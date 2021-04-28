import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Select, Row, Col, message, Form, Input} from 'antd';

import Page from '../../components/Page';
import ShopOverview from '../../components/UI/ShopOverview';
import Loader from "../../components/UI/Loader";
import {InfoCircleOutlined} from "@ant-design/icons";
import {api, api as GeocoderAPI} from '../../hooks/geocoding';

const { Option } = Select;
const { Item } = Form;

let isIntersecting = true;
export default function Home() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [usedGps, setUsedGps] = useState(false);
    const { stores } = useSelector(state => state.app);
    const [sort, setSort] = useState(undefined);
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [location, setLocation] = useState(null);


    useEffect(async () => {
        if(hasMore || page === 1) {
            let body = {
                page_number: page,
                page_size: 16,
            }
            if(sort) {
                body.sort = sort;
            }
            if(location) {
                body.lat = location.lat;
                body.lng = location.lng;
            }
            try {
                const response = await dispatch.app.getStores(body)
                if(response.data.length < 16) {
                    setHasMore(false);
                }
            } catch(e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
        isIntersecting = true;
    }, [page, sort, location])


    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, []);


    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && isIntersecting) {
            isIntersecting = false
            setPage((page) => page + 1)
        }
    }


    const searchWithGps = async (values) => {
        const value = values.postalCode;
        if(value === "" || !value) {
            setLocation(null);
            setPage(1);
            setHasMore(true)
            setUsedGps(false);
            return true;
        }
        if (/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/.test(value)) {
            const transformedPostal = value.slice(0, 3).trim() + " " + value.slice(-3).trim();

            try {

                const res = await api.get("json", {
                    params: {
                        address: transformedPostal,
                        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
                    }
                })
                if(res?.status === "OK") {
                    const geoCode = res?.results?.[0]?.geometry?.location;
                    setLocation(geoCode);
                    setPage(1);
                    setHasMore(true)
                    setUsedGps(true);
                    return true;
                }
            } catch(e) {
                message.error("Your Postal Code isn\'t valid.")
                return e;
            }
        }
    }

    const sortHandler = parameter => {
        if(parameter === 'address') {
            searchWithGps();
        } else {
            isIntersecting = false;
            setHasMore(true);
            setSort(parameter)
            setPage(1);
        }
    }

    return (
        <Page title={false} breadcrumb={false}>

            <div className={'mb-16 without-padding'}>
                <Row className={'bg-card flex items-center pt-12 pb-6 layout__section'}>
                    <Col xs={24}>
                        <Form form={form} layout={'vertical'} onFinish={searchWithGps} className={'pl-4 lg:pl-0'}>
                            <Row gutter={24} className={'flex flex-col lg:flex-row justify-center lg:items-center'}>
                                <Col xs={24} lg={16}>
                                    <Item name={'postalCode'} label={'Postal Code'}>
                                        <Input placeholder={'Postal Code'} allowClear/>
                                    </Item>
                                </Col>
                                <Col xs={24} lg={3} style={{ flexBasis: 125}}>
                                    <Item>
                                        <Button type={'primary'} className={'w-full lg:w-32 mt-7.5'} htmlType={'submit'}>Search</Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4">
                    <h2 className={'text-xl font-medium m-0 mb-2 text-label'}>Stores!!!</h2>
                    <Select
                        placeholder={'Sort by name'}
                        className={'sort-field-input'}
                        onChange={sortHandler}
                    >
                        <Option value={''}>Default</Option>
                        <Option value={'name'}>Name</Option>
                        <Option value={'storeType'}>Store Type</Option>
                        <Option value={'address'}>Address</Option>
                    </Select>
                </div>

                {!hasMore && stores.length === 0 ? (
                    <Row gutter={24}>
                        <Col xs={24} className={'flex flex-col items-center justify-center pt-6'}>
                            <InfoCircleOutlined className={'text-paragraph mb-6 text-4xl'} />
                            <span className="text-paragraph mb-4">{usedGps ? 'There is no Store near your location' : 'There is no store'}</span>
                        </Col>
                    </Row>
                ) : (
                    <Row gutter={[32, 32]}>
                        {stores.map((item ,index) => {
                            return (
                                <Col xs={12} sm={12} md={12} lg={8} xl={6} key={`shop-${index}`}>
                                    <ShopOverview
                                        _id={item._id}
                                        imageURL={item.image}
                                        title={item.title || ''}
                                        name={item.name || ''}
                                        service={item.storeType || ''}
                                        subType={item.subType || ''}
                                    />
                                </Col>
                            )
                        })}
                    </Row>
                )}
                <div ref={loader}>
                    {hasMore && (
                        <div className="flex flex-row items-center justify-center py-10">
                            <Loader/>
                        </div>
                    )}
                </div>
            </div>
        </Page>
    )
}
