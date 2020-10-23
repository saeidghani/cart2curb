import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select,
    Space,
    TimePicker,
    Radio,
    Table
} from 'antd';

import Page from '../../../../components/Page';
import {HeaderLogoIcon} from "../../../../components/icons";
import DetailItem from "../../../../components/UI/DetailItem";

const { Item } = Form;
const { Option } = Select;

const Invoices = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Delivery',
            href: '/cart/delivery'
        },
        {
            title: 'Invoice'
        }
    ]

    const columns = [
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
        },
        {
            title: 'Cart Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Delivery Cost',
            dataIndex: 'delivery',
            key: 'delivery',
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
        },
    ];

    const fakeData = [
        {
            key: 'cart',
            items: 10,
            price: '$160.30',
            delivery: '$15.20',
            total: '$175.50'
        }
    ]

    return (
        <Page title={'Checkout'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={18}>
                    <HeaderLogoIcon/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Date'} value={'2020.02.20'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Company'} value={'Cart2Curb'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={'+1 234 (567) 7342'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={'info@Cart2curb.com'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Number'} value={'#21'}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'my-8'}/>
                </div>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Customer Name'} value={'Barry Wood'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={'+1 234 (567) 8910'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={'Barry@gmail.com'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Date'} value={'02.02.2020'}/>
                </Col>

                <Col xs={24} md={12}>
                    <DetailItem title={'Address'} value={'Address Line 2, Address Line 2, City, State, Country, Zip Code'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Scheduled Delivery Time'} value={'02.05.2020 | 12:30 - 13:30'}/>
                </Col>
                <Col xs={24}>
                    <DetailItem title={'Comments'} value={'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'my-8'}/>
                </div>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Store #1 Name'} value={'Store name'}/>
                </Col>

                <Col xs={24}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={fakeData}
                    />
                </Col>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'tip'} label={'Tip'}>
                                    <Input placeholder={'Tip'}/>
                                </Item>
                            </Col>
                            <Col lg={16} md={12} xs={24} className={'md:pt-7.5 mb-6'}>
                                <Space size={16}>
                                    <Button className={'w-16'} type={'primary'}>10%</Button>
                                    <Button className={'w-16'} danger>15%</Button>
                                    <Button className={'w-16'} danger>20%</Button>
                                    <Button className={'w-16'} danger>25%</Button>
                                    <Button className={'w-22'} danger>Custom</Button>
                                </Space>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'promo'} label={'Promo'}>
                                    <Input placeholder={'Promo'}/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24} className={'md:pt-7.5'}>
                                <Button className={'w-32'} danger size={'lg'}>Apply</Button>
                            </Col>

                            <Col lg={8} md={12} xs={24} className={'flex flex-row-reverse items-center'}>
                                <div className="flex flex-col pl-4 justify-end">
                                    <h1 className="text-right text-4.5xl text-paragraph font-medium mb-2 mt-0">$$$</h1>
                                    <span className="text-xs text-header">+ $15 Service Fee</span>
                                </div>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Next
                                    </Button>
                                </Item>
                                <Item>
                                    <Button danger className={'w-32'}>
                                        Prev
                                    </Button>
                                </Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>
        </Page>
    )
}

export default Invoices;