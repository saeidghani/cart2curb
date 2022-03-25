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

const ProductView = props => {
    const router = useRouter();
    const screens = Grid.useBreakpoint();
    const dispatch = useDispatch();
    const {storeId, productId, storeType} = router.query;
    const token = store?.getState()?.adminAuth?.token;
    const product = useSelector(state => state?.adminStore?.product);

    useEffect(() => {
        if (storeId && productId && token) {
            dispatch?.adminStore?.getProduct({storeId, productId, token});
        }
    }, [storeId, productId, token]);

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'product', storeId, storeType}
        },
        {
            title: 'Products',
            href: routes.admin.stores.storeDetails,
            query: {tab: 'product', storeId, storeType}
        },
        {
            title: 'View',
        }
    ]

    const address = `${product?.store?.address?.addressLine1 || ''}${product?.store?.address?.addressLine2 ? product?.store?.address?.addressLine2 : ''} ${product?.store?.address?.city || ''} ${product?.store?.address?.province || ''} ${product?.store?.address?.country || ''}`;

    return (
        <Page title={'Product'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    {product?.images && <NoSSR>
                        <ProductCarousel slides={product?.images}/>
                    </NoSSR>}
                </Col>
                <Col lg={16} md={12} xs={24}>
                    <Row>
                        <Col xs={24} className={`flex flex-col`}>
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-paragraph text-2xl text-label font-medium my-0">{product?.name}</h1>
                                    <span className="text-overline text-lg font-normal">{product?.category?.name}</span>
                                </div>
                                <div className="actions flex items-center">
                                    <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
                                        <Button type={'text'} className={'text-type text-base font-medium'}
                                                onClick={deleteModal.bind(this, {
                                                    onOk: async () => {
                                                        const res = await dispatch?.adminStore?.deleteProduct({
                                                            storeId,
                                                            productId,
                                                            token
                                                        });
                                                        if (res) {
                                                            router.push({
                                                                pathname: routes.admin.stores.storeDetails,
                                                                query: {storeId, storeType, tab: 'product'}
                                                            });
                                                        }
                                                    },
                                                    okText: 'OK',
                                                    title: 'Do you want to delete this product?',
                                                    content: 'Are you sure to delete this product? There is no going back!!',
                                                })}
                                        >
                                            Delete
                                        </Button>
                                        <Link
                                            href={{
                                                pathname: routes.admin.products.edit(productId),
                                                query: {storeId, storeType}
                                            }}>
                                            <Button
                                                type={'text'}
                                                className={'text-info hover:text-teal-500 text-base font-medium'}
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <Row gutter={[24, 32]}>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Weight'}
                                                value={product?.weight ? getProperty(product, 'weight', '-', (data) => `${data}${product?.weightUnit}`) : '-'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Price per Weight'}
                                                value={getProperty(product?.priceList, 'price', '-', (data) => `$${data}`)}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Tax Rate'}
                                                value={getProperty(product, 'tax', '-', (data) => `${data}%`)}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Total Price'}
                                                value={`$${product?.priceList?.price + product?.priceList?.cost}`}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Stock'} value={getProperty(product, 'stock', '-')}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Store Address'} value={address}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Cost Price'}
                                                value={getProperty(product?.priceList, 'cost', '-', (data) => `$${data}`)}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'md:pt-16 pt-4'}>
                <Col xs={24}>
                    <h1 className={'text-2xl text-type mb-6 mt-0'}>Description</h1>
                    <p className="text-muted">{product?.description}</p>
                </Col>
            </Row>
        </Page>
    )
}

export default ProductView;