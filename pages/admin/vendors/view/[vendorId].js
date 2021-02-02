import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Grid, Row, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import Link from "next/link";

import Page from "../../../../components/Page";
import Avatar from "../../../../components/UI/Avatar";
import DetailItem from "../../../../components/UI/DetailItem";
import AdminAuth from "../../../../components/Admin/AdminAuth";
import {getProperty} from "../../../../helpers";
import routes from "../../../../constants/routes";

const VendorDetails = props => {
    const screens = Grid.useBreakpoint();
    const dispatch = useDispatch();
    const [isBlocked, setIsBlocked] = useState(false);
    const router = useRouter();
    const token = useSelector(state => state?.adminAuth?.token);
    const storeDetails = useSelector(state => state?.adminStore?.store);
    const {storeId, vendorId} = router.query;

    const {vendor, store} = storeDetails || {};

    useEffect(() => {
        if (token && storeId) {
            dispatch.adminStore?.getStore(storeId);
        }
    }, [storeId, token]);

    useEffect(() => {
        if (!vendor?.isApproved) setIsBlocked(true);
    }, [vendor]);

    const blockHandler = async () => {
        const res = await dispatch.adminUser.addPendingVendor({
            vendorId,
            body: {isApproved: isBlocked ? true : false},
            token
        });
        if (res) {
            if (isBlocked) {
                setIsBlocked(false);
            } else {
                setIsBlocked(true);
            }
        }
    };

    const breadcrumb = [
        {
            title: `Vendor Profile`,
        },
    ]

    const address = `${store?.address?.addressLine1}${store?.address?.addressLine2 ? store?.address?.addressLine2 : ''} ${store?.address?.city} ${store?.address?.province} ${store?.address?.country}`;

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Vendor Details'} breadcrumb={breadcrumb}>
                <Col xs={24} className={`flex flex-col`}>
                    <div className="flex items-center justify-between">
                        <h1 className="page__title text-2xl text-type font-medium my-0">Account</h1>
                        <div className="actions flex items-center">
                            <Button type={'text'} className={'text-xs'} danger onClick={blockHandler}>{!isBlocked ? 'Block' : 'Unblock'}</Button>
                            <Link href={routes.admin.vendors.edit(vendorId)}>
                                <Button type={'text'}
                                        className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
                            </Link>
                        </div>
                    </div>
                    <Divider/>
                </Col>
                <Row className="">
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
                            <Col xs={24} sm={12} lg={6}>
                                <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Type'}
                                            value={getProperty(store, 'storeType', '-')}/>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Sub Type'}
                                            value={getProperty(store, 'subType', '-')}/>
                            </Col>
                            <Col xs={24}>
                                <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Address'}
                                            value={address}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Page>
        </AdminAuth>
    )
}

export default VendorDetails;
