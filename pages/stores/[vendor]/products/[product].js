import React from 'react';
import { useRouter } from "next/router";
import {Row, Col, Space, Button, Grid, InputNumber} from 'antd';

import DetailItem from "../../../../components/UI/DetailItem";
import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import ProductCarousel from "../../../../components/UI/ProductCarousel";
import Link from "next/link";
import deleteModal from "../../../../components/Modals/Delete";
import ProductCard from "../../../../components/UI/ProductCard";

const ProductView = props => {
    const router = useRouter();
    const screens = Grid.useBreakpoint();
    console.log(router);

    const breadcrumb = [
        {
            title: 'Vendors',
            href: routes.stores.index,
        },
        {
            title: `${router.query.vendor}`,
            href: routes.stores.single(`${router.query.vendor}`),
        },
        {
            title: router.query.product
        }
    ]

    return (
        <Page title={`Product ${router.query.product}`} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8} xl={6}>
                    <ProductCarousel slides={[
                        '/images/temp/product1.jpg',
                        '/images/temp/product2.jpg',
                        '/images/temp/product3.png',
                        '/images/temp/product1.jpg',
                        '/images/temp/product2.jpg',
                        '/images/temp/product3.png',
                    ]}/>
                </Col>
                <Col xl={18} lg={16} md={12} xs={24}>
                    <Row gutter={[0, 69]}>
                        <Col xs={24} className={`flex flex-col`}>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-paragraph text-2xl text-label font-medium my-0">Choice Beef Brisket Chunk</h1>
                                    <span className="text-overline text-lg font-normal">Cat #1</span>
                                </div>
                                <div className="actions flex items-center">
                                    <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
                                        <Button type={'text'} className={'text-type text-base font-medium'} onClick={deleteModal.bind(this, {
                                            onOk: () => console.log('you deleted product'),
                                            okText: 'Ok',
                                            title: 'Do you want to delete this product?',
                                            content: 'Are you sure to delete this product? There is no going back!!',
                                        })}
                                        >
                                            Delete
                                        </Button>
                                        <Link href={routes.vendors.products.edit()} as={routes.vendors.products.edit(router.query.number)}>
                                            <Button type={'text'} className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
                                        </Link>
                                    </Space>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <Row gutter={[24, 32]}>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Weight'} value={'1000 g'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Price per Weight'} value={'$10'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Tax Rate'} value={'16%'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Total Price'} value={'$16.20'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Stock'} value={'63'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Store Address'} value={'Address 1'}/>
                                </Col>
                                <Col lg={8} xs={12}>
                                    <DetailItem title={'Cost Price'} value={'$8.50'}/>
                                </Col>
                                <Col xs={24}>
                                    <div className="pt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between">
                                        <div className="flex flex-col justify-center pb-4 lg:pb-0">
                                            <span className="text-xs text-muted pb-2">Quantity</span>
                                            <InputNumber min={1} max={10} defaultValue={1}/>
                                        </div>

                                        <div className={'flex flex-col lg:flex-row items-start lg:items-center'}>
                                            <span className="text-paragraph font-bold text-base pr-4">$15 TAX</span>
                                            <div className="bg-primary py-2 rounded-sm flex flex-row items-center">
                                                <span className="text-white px-8 py-1.5 border-r border-white font-bold text-base flex">$120.50 TOTAL</span>
                                                <Button type={'link'} className={' px-8 py-1.5 text-white hover:text-white font-bold text-base'}>Add To Cart</Button>
                                            </div>

                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'md:pt-16 pt-0'}>
                <Col xs={24}>
                    <h1 className={'text-2xl text-type mb-6 mt-0'}>Description</h1>
                    <p className="text-muted">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                </Col>
            </Row>
            <Row className={'md:pt-16 pt-0'}>
                <Col xs={24}>
                    <h1 className={'text-2xl text-type mb-6 mt-0'}>Related Products</h1>
                </Col>
                <Col xs={24}>
                    <Row gutter={[24, 24]}>
                        {[...Array(6)].map((item, index) => {
                            return (
                                <Col key={`related-${index}`} xl={4} lg={6} md={8} sm={12} xs={24}>
                                    <ProductCard/>
                                </Col>
                            )
                        })}
                        <Col xs={24} className={'flex flex-row-reverse'}>
                            <Button className="w-32" danger>See More</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    )
}

export default ProductView;