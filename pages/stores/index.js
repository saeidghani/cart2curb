import React, {useEffect, useState} from 'react';
import {Button, Select, Row, Col, message} from 'antd';

import Page from '../../components/Page';
import ShopOverview from '../../components/UI/ShopOverview';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../components/UI/Loader";
import {InfoCircleOutlined} from "@ant-design/icons";

const { Option } = Select;

export default function Stores() {
    const dispatch = useDispatch();
    const [usedGps, setUsedGps] = useState(false);
    const storesLoading = useSelector(state => state.loading.effects.app.getStores)
    const { stores } = useSelector(state => state.app);

    useEffect(() => {
        dispatch.app.getStores();
    }, [])

    const searchWithGps = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                dispatch.app.getStores({
                    ...pos
                })
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

    return (
        <Page title={false} breadcrumb={[{ title: 'Home' }]}>
            <div className="flex items-center justify-between bg-primary p-4 mb-16">
                <span className="text-2xl font-bold text-white pl-6">Search By GPS</span>
                <Button type={'primary'} className={'bg-white hover:bg-input hover:text-primary text-primary w-32'} onClick={searchWithGps}>Search</Button>
            </div>
            <div className="flex flex-col">

                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4">
                    <h2 className={'text-xl font-medium m-0 mb-2 text-type'}>Most Popular Stores</h2>
                    <Select
                        placeholder={'Sort by name'}
                        style={{ minWidth: 370 }}
                    >
                        <Option value={'name'}>Name</Option>
                        <Option value={'date'}>Date</Option>
                        <Option value={'Gps'}>Gps</Option>
                    </Select>
                </div>

                {storesLoading ? (

                    <div className="flex flex-row items-center justify-center py-10">
                        <Loader/>
                    </div>
                ) : stores.length === 0 ? (
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
                )
                }
            </div>
        </Page>
    )
}
