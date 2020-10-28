import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    DatePicker,
    Divider
} from 'antd';

import Page from '../../../components/Page';

const { Item } = Form;

const GuestCheckout = props => {
    const [form] = Form.useForm();


    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Guest'
        }
    ]

    return (
        <Page title={'Guest Cart'} breadcrumb={breadcrumb}>
            <h2 className="text-type font-medium text-base mb-6">Credit Card Info</h2>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col md={8} xs={24}>
                    <div className="pb-6 w-full h-full">
                        <div className="border border-input rounded-sm px-7.5 py-4.5 h-full">
                            <Row>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Cart Price</span>
                                    <span className="text-type font-medium">$12.65</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Substitution</span>
                                    <span className="text-type font-medium">$6.20</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Delivery</span>
                                    <span className="text-type font-medium">$8.00</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Promo Code</span>
                                    <span className="text-type font-medium">-$13.20</span>
                                </Col>
                                <Divider className={'my-2'}/>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Total Price</span>
                                    <span className="text-type font-medium text-xl">$14.80</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col md={16} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col md={12} xs={24}>
                                <Item name={'card-number'} label={'Card Number'}>
                                    <Input placeholder="Card Number" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'firstname'} label={'First Name'}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'cvv'} label={'Cvv'}>
                                    <Input placeholder="Cvv" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'lastname'} label={'Last Name'}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item label={'Expiration Date'} className={'mb-0'}>
                                    <Row gutter={24}>

                                        <Col xs={12}>
                                            <Item name={'year'}>
                                                <DatePicker className={'w-full'} picker={'year'}/>
                                            </Item>
                                        </Col>
                                        <Col xs={12}>
                                            <Item name={'month'}>
                                                <DatePicker className={'w-full'} picker={'month'} format={'MMMM'}/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Item>
                            </Col>

                            <Col md={12} xs={24} className={'flex items-center flex-row-reverse'}>
                                <Item className={'mb-0'}>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Next
                                    </Button>
                                </Item>
                                <Item className={'mb-0'}>
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

export default GuestCheckout;