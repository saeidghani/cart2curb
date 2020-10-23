import React from 'react';
import { Button, Select, Row, Col } from 'antd';

import Page from '../../components/Page';
import ShopOverview from '../../components/UI/ShopOverview';
const { Option } = Select;

export default function Vendors() {
    const breadcrumb = [
        {
            title: "Vendors",
        }
    ]
    return (
        <Page title={false} breadcrumb={breadcrumb} hasHome={true}>
            <div className="flex items-center justify-between bg-primary p-4 mb-16">
                <span className="text-2xl font-bold text-white pl-6">Search By GPS</span>
                <Button type={'primary'} className={'bg-white hover:bg-input hover:text-primary text-primary w-32'}>Search</Button>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4">
                    <h2 className={'text-xl font-medium m-0 mb-2'}>Most Popular Stores</h2>
                    <Select
                        placeholder={'Sort by name'}
                        style={{ minWidth: 370 }}
                    >
                        <Option value={'name'}>Name</Option>
                        <Option value={'date'}>Date</Option>
                        <Option value={'Gps'}>Gps</Option>
                    </Select>
                </div>

                <Row gutter={[50, 50]}>
                    {[...Array(16)].map((item ,index) => {
                        return (
                            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={`shop-${index}`}>
                                <ShopOverview
                                    imageURL={'/images/temp/shop-item.png'}
                                    title={'Illinois'}
                                    name={'Store name'}
                                    service={'Type/Service'}
                                    subType={'sub Type'}
                                />
                            </Col>
                        )
                    })}
                </Row>

            </div>
        </Page>
    )
}
