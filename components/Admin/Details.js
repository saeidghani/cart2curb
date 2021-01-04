import React, {useEffect} from 'react';
import {Col, Divider, Grid, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";

import Page from "../Page";
import Avatar from "../UI/Avatar";
import DetailItem from "../UI/DetailItem";
import {getProperty} from "../../helpers";

const Details = props => {
    const screens = Grid.useBreakpoint();
    const dispatch = useDispatch();
    const router = useRouter();
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
    const storeDetails = useSelector(state => state?.adminStore?.store);
    const {storeId} = router.query;

    const {vendor, store} = storeDetails || {};

    useEffect(() => {
        if (isLoggedIn) {
            dispatch.adminStore?.getStore(storeId);
        }
    }, [storeId, isLoggedIn]);

    const address = [store?.address?.addressLine1];
    if (store?.address?.addressLine2) {
        address.push(store?.address?.addressLine2);
    }
    address.push(store?.address?.city);
    address.push(store?.address?.province);
    address.push(store?.address?.country);

    return (
        <>
            <h1 className="text-2xl text-type font-medium mb-6">Vendor Detail Page</h1>
            <Row gutter={16}>
                <Col xs={6}>
                    <img src={store?.image} alt=""/>
                </Col>
                <Col xs={18}>
                    <div className="text-2xl">{store?.name}</div>
                    <div className="text-sm mt-2">{store?.address?.country}</div>
                    <div className="text-sm mt-4" style={{color: '#C1C4C8'}}>{store?.subType}</div>
                </Col>
            </Row>

            <Row className="mt-8">
                <Col xs={24} className={`flex flex-col`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl text-type font-medium my-0">Vendor Profile</h3>
                    </div>
                    <Divider/>
                </Col>
                <Col xs={24}>
                    <Row gutter={[24, 36]} className={'flex flex-row flex-wrap items-center pt-4'}>
                        <Col xs={24} sm={12} lg={6}>
                            <Avatar src={vendor?.image} justImage/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Company Name'}
                                        value={getProperty(store, 'name', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Main Contact Name'}
                                        value={getProperty(vendor, 'contactName', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Mobile'}
                                        value={getProperty(vendor, 'phone', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Email'}
                                        value={getProperty(vendor, 'email', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Opening Hour'}
                                        value={getProperty(store, 'openingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Closing Hour'}
                                        value={getProperty(store, 'closingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Gathering Method'}
                                        value={!store?.hasOwnProperty('needDriversToGather') ? '-' : store.needDriversToGather ? 'by Cart2Curb' : 'by Store'}/>
                        </Col>
                        <Col xs={24}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Description'}
                                        value={getProperty(store, 'description', '-')}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Details;
