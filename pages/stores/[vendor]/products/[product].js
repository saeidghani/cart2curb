import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import {Row, Col, Button, InputNumber, message} from 'antd';
import NoSSR from 'react-no-ssr';

import DetailItem from "../../../../components/UI/DetailItem";
import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import ProductCarousel from "../../../../components/UI/ProductCarousel";
import Link from "next/link";
import ProductCard from "../../../../components/UI/ProductCard";
import {getStore} from "../../../../states";
import {useDispatch, useSelector} from "react-redux";


const ProductView = props => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const loading = useSelector(state => state.loading.effects.cart.addToCart);
    const dispatch = useDispatch();
    const { product, related, storeProfile, relatedMetaData } = props;
    const [transformedRelated, setTransformedRelated] = useState([]);

    useEffect(() => {
        const result = related.filter(item => item._id !== product._id).slice(0, 6);
        setTransformedRelated(result);
    }, [props])

    const breadcrumb = [
        {
            title: 'Vendors',
            href: routes.stores.index,
        },
        {
            title: `Vendor`,
            href: routes.stores.single(`${router.query.vendor}`),
        },
        {
            title: product.name
        }
    ]
    const total = product.priceList.price;
    const tax = (quantity * total * product.tax / 100).toFixed(2)

    const addToCartHandler = async () => {
        const body = {
            productId: product._id,
            quantity
        }

        const res = await dispatch.cart.addToCart(body)
        if(res) {
            message.success('Product added to your cart');
            setQuantity(1);
        }
    }

    return (
        <Page title={product.name} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <NoSSR>
                        <ProductCarousel slides={product.images}/>
                    </NoSSR>
                </Col>
                <Col lg={16} md={12} xs={24}>
                    <Row>
                        <Col xs={24} className={`flex flex-col`}>
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-paragraph text-2xl text-label font-medium my-0">{product.name}</h1>
                                    <span className="text-info text-lg font-normal">{product.category.name}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <Row gutter={[24, 24]}>
                                {product?.unitType === 'weight' && (
                                    <Col lg={8} xs={12}>
                                        <DetailItem title={'Weight'} value={`${product.weight} ${product.weightUnit}`}/>
                                    </Col>
                                )}
                                <Col lg={8} xs={12}>
                                    <DetailItem title={`Price`} value={`$${product.priceList.price}`}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Store'} value={storeProfile.name || '-'}/>
                                </Col>
                                <Col xs={24}>
                                    <div className="pt-11 flex flex-col lg:flex-row items-start lg:items-center justify-between">
                                        <div className="flex flex-col justify-center pb-4 lg:pb-0">
                                            <span className="text-xs text-muted pb-2">Quantity</span>
                                            <InputNumber
                                                min={1}
                                                //max={10}
                                                value={quantity}
                                                onChange={setQuantity}
                                            />
                                        </div>

                                        <div className={'flex flex-col lg:flex-row items-start lg:items-center'}>
                                            <span className="text-paragraph font-bold text-base pr-4">${tax} TAX</span>
                                            <div className="bg-primary py-2 rounded-sm flex flex-row items-center">
                                                <span className="text-white px-8 py-1.5 border-r border-white font-bold text-base flex">${(quantity * Number(total) + Number(tax)).toFixed(2)} TOTAL</span>
                                                <Button type={'link'} className={' px-8 py-1.5 text-white hover:text-white focus:text-white focus:bg-transparent font-bold text-base flex items-center without-before'} onClick={addToCartHandler} loading={loading}>Add To Cart</Button>
                                            </div>

                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'md:pt-16 pt-4'}>
                <Col xs={24}>
                    <h1 className={'text-2xl text-type mb-6 mt-0'}>Description</h1>
                    <p className="text-muted">{product.description}</p>
                </Col>
            </Row>
            {transformedRelated.length > 0 && (
                <Row className={'md:pt-16 pt-12'}>
                    <Col xs={24}>
                        <h1 className={'text-2xl text-type mb-6 mt-0'}>Related Products</h1>
                    </Col>
                    <Col xs={24}>
                        <Row gutter={[24, 24]}>
                            {transformedRelated.length > 0 ? transformedRelated.map((item, index) => {
                                return (
                                    <Col key={`related-${index}`} xl={4} lg={6} md={8} sm={12} xs={24}>
                                        <ProductCard images={item.images} _id={item._id} vendor={router.query.vendor} name={item.name}/>
                                    </Col>
                                )
                            }) : null}
                            {relatedMetaData.pagination.totalRecords > 6 && (
                                <Col xs={24} className={'flex flex-row-reverse justify-center md:justify-start'}>
                                    <Link href={routes.stores.single(router.query.vendor)}>
                                        <Button className="w-32" danger>See More</Button>
                                    </Link>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            )}
        </Page>
    )
}



export async function getServerSideProps({ req, res, params }) {
    const store = getStore()

    let product = {};
    let related = [];
    let storeProfile = {};
    let relatedMetaData = {}

    try {
        const response = await store.dispatch.app.getProduct(params.product)
        if(typeof response === 'string' || typeof response === 'number' || !response) {
            res.writeHead(307, { Location: routes.stores.single(params.vendor) });
            res.end();
            return {
                props: {
                    product,
                    related,
                    relatedMetaData,
                    storeProfile
                }
            };
        }
        const relatedResponse = await store.dispatch.app.getProducts({
            pageNumber: 1,
            pageSize: 6,
            storeId: params.vendor,
            category: response.category._id
        })

        const storeResponse = await store.dispatch.app.getStore(params.vendor);

        storeProfile = storeResponse
        related = relatedResponse.data.filter(item => item._id !== product._id);
        relatedMetaData = relatedResponse.metaData;
        product = response;
    } catch(e) {
        console.log(e);

        res.writeHead(307, { Location: routes.stores.index });
        res.end();
        return {
            props: {
                product,
                related,
                relatedMetaData,
                storeProfile
            }
        };
    }
    return {
        props: {
            product,
            related,
            relatedMetaData,
            storeProfile
        },
    }
}


export default ProductView;
