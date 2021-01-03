import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
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
    const {storeId, productId} = router.query;
    const token = store?.getState()?.adminAuth?.token;
    const product = useSelector(state => state?.adminStore?.product);

    useEffect(() => {
       const product = dispatch?.adminStore?.getProduct({storeId, productId, token});
    }, [storeId, productId, token]);

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.admin.index,
        },
        {
            title: 'Products',
            href: routes.admin.products.index,
        },
        {
            title: product?.name
        }
    ]

    /*const address = [profile?.store?.address?.addressLine1];
    if(profile?.store?.address?.addressLine2) {
        address.push(profile?.store?.address?.addressLine2);
    }
    address.push(profile?.store?.address?.city);
    address.push(profile?.store?.address?.province);
    address.push(profile?.store?.address?.country);*/

    return (
        <Page title={'Product'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <NoSSR>
                        <ProductCarousel slides={product?.images}/>
                    </NoSSR>
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
                                        <Button type={'text'} className={'text-type text-base font-medium'} onClick={deleteModal.bind(this, {
                                            onOk: async () => {
                                                const res = await dispatch?.adminStore?.deleteProduct(product?._id);
                                                if(res) {
                                                    router.push(routes.admin.index);
                                                }
                                            },
                                            okText: 'Ok',
                                            title: 'Do you want to delete this product?',
                                            content: 'Are you sure to delete this product? There is no going back!!',
                                        })}
                                        >
                                            Delete
                                        </Button>
                                        <Link href={{pathname: routes.admin.products.edit(), query: {storeId}}} as={routes.admin.products.edit(product?._id)}>
                                            <Button type={'text'} className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
                                        </Link>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <Row gutter={[24, 32]}>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Weight'} value={product?.weight ? getProperty(product, 'weight', '-', (data) => `${data}${product?.weightUnit}`) : '-'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Price per Weight'} value={getProperty(product?.priceList, 'price', '-', (data) => `$${data}`)}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Tax Rate'} value={getProperty(product, 'tax', '-', (data) => `${data}%`)}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Total Price'} value={`$${product?.priceList?.price + product?.priceList?.cost}`}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Stock'} value={getProperty(product?.priceList, 'stock', '-')}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    {/*<DetailItem title={'Store Address'} value={address?.join(", ")}/>*/}
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Cost Price'} value={getProperty(product?.priceList, 'cost', '-', (data) => `$${data}`)}/>
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


/*export async function getServerSideProps({ req, res, params }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let product = {};
    let profile = {}

    if (!token) {
        res.writeHead(307, { Location: routes.admin.auth.login });
        res.end();
        return {
            props: {
                product,
                profile
            }
        };
    }

    if(cookies.type !== 'admin') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                product,
                profile
            }
        };
    }


    const store = getStore();
    const response = await store.dispatch.adminStore.getProduct({
        id: params.number,
        token,
    })
    if(!response) {
        res.writeHead(307, { Location: routes.admin.index });
        res.end();
        return {
            props: {
                product,
                profile
            }
        };
    }
    const profileRes = await store.dispatch.adminProfile.getProfile({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(profileRes) {
        profile = profileRes;
    }
    if(response) {
        product = response;
    }
    return {
        props: {
            product,
            profile,
        }
    }
}*/

export default ProductView;