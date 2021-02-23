import React, {useEffect, useRef, useState} from 'react';
import {Button, Select, Row, Col, message} from 'antd';

import Page from '../components/Page';
import ShopOverview from '../components/UI/ShopOverview';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/UI/Loader";
import {InfoCircleOutlined} from "@ant-design/icons";

const { Option } = Select;

let isIntersecting = true;
export default function Home() {
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


    const searchWithGps = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                isIntersecting = false;
                setLocation({
                    ...pos,
                })
                setPage(1);
                setHasMore(true)
                setUsedGps(true);
            }, (e) => {
                if(e.code === 2) {
                    message.error('Your device doesn\'t support this feature')
                } else if(e.code === 1) {
                    message.error('You not allowed this service to find your location')
                }
                console.log(e);
            });
        } else {
            message.error('Your device doesn\'t support this feature or you not allowed')
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
        <Page title={false}>
            <div className="flex items-center justify-between bg-primary p-4 mb-16">
                <span className="text-2xl font-bold text-white pl-6">Search Stores Near Me</span>
                <Button type={'primary'} className={'bg-white hover:bg-input hover:text-primary text-primary w-32'} onClick={searchWithGps}>Search</Button>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4">
                    <h2 className={'text-xl font-medium m-0 mb-2 text-label'}>Stores</h2>
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
                    <Row gutter={[50, 50]}>
                        {stores.map((item ,index) => {
                            return (
                                <Col xs={24} sm={12} md={12} lg={8} xl={6} key={`shop-${index}`}>
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
