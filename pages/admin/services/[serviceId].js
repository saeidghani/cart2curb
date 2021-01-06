import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Space, Button, Divider, Grid} from 'antd';
import Link from "next/link";
import NoSSR from "react-no-ssr";

import DetailItem from "../../../components/UI/DetailItem";
import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import ProductCarousel from "../../../components/UI/ProductCarousel";
import deleteModal from "../../../components/Modals/Delete";
import store, {getStore} from "../../../states";
import {getProperty} from "../../../helpers";

const ServiceView = props => {
    const router = useRouter();
    const screens = Grid.useBreakpoint();
    const dispatch = useDispatch();
    const {storeId, serviceId, storeType} = router.query;
    const token = store?.getState()?.adminAuth?.token;
    const service = useSelector(state => state?.adminStore?.service);

    useEffect(() => {
        if (storeId && serviceId && token) {
            dispatch?.adminStore?.getService({storeId, serviceId, token});
        }
    }, [storeId, serviceId, token]);

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.admin.stores.storeDetails
        },
        {
            title: 'Services',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'service', storeId, serviceId, storeType}
        },
        {
            title: 'View',
        }
    ]

    const {store} = service || {};

    const address = `${store?.address?.addressLine1}${store?.address?.addressLine2 ? store?.address?.addressLine2 : ''} ${store?.address?.city} ${store?.address?.province} ${store?.address?.country}`;

    return (
        <Page title={'Service'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <NoSSR>
                        <ProductCarousel slides={service?.images}/>
                    </NoSSR>
                </Col>
                <Col lg={16} md={12} xs={24}>
                    <Row>
                        <Col xs={24} className={`flex flex-col`}>
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-paragraph text-2xl text-label font-medium my-0">{service?.name}</h1>
                                    <span className="text-overline text-lg font-normal">{service?.category?.name}</span>
                                </div>
                                <div className="actions flex items-center">
                                    <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
                                        <Button type={'text'} className={'text-type text-base font-medium'}
                                                onClick={deleteModal.bind(this, {
                                                    onOk: async () => {
                                                        const res = await dispatch?.adminStore?.deleteService({storeId, serviceId, token});
                                                        if (res) {
                                                            router.push({pathname: routes.admin.stores.storeDetails, query: {storeId, storeType, tab: 'service'}});
                                                        }
                                                    },
                                                    okText: 'Ok',
                                                    title: 'Do you want to delete this service?',
                                                    content: 'Are you sure to delete this service? There is no going back!!',
                                                })}
                                        >
                                            Delete
                                        </Button>
                                        <Link
                                            href={{pathname: routes.admin.services.edit(serviceId), query: {storeId, storeType}}}
                                            as={routes.admin.services.edit(service?._id)}>
                                            <Button type={'text'}
                                                    className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
                                        </Link>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <Row gutter={[24, 32]}>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Total Price'}
                                                value={service?.weight ? getProperty(service, 'weight', '-', (data) => `${data}${service?.weightUnit}`) : '-'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Tax Rate'}
                                                value={getProperty(service, 'tax', '-', (data) => `${data}%`)}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Store Address'}
                                                value={address}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Cost Price'}
                                                value={getProperty(service?.priceList, 'cost', '-', (data) => `$${data}`)}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'md:pt-16 pt-4'}>
                <Col xs={24}>
                    <h1 className={'text-2xl text-type mb-6 mt-0'}>Description</h1>
                    <p className="text-muted">{service?.description}</p>
                </Col>
            </Row>
        </Page>
    )
}

export default ServiceView;