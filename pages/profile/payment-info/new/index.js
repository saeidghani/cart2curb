import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    DatePicker
} from 'antd';

import Page from '../../../../components/Page';
import routes from "../../../../constants/routes";

const { Item } = Form;

const AddPaymentInfo = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: "Payment Info",
            href: routes.profile.payments.index
        },
        {
            title: 'Add Credit Card Info'
        }
    ]


    return (
        <Page title={false} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'card-number'} label={'Card Number'}>
                                    <Input placeholder="Card Number" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'firstname'} label={'First Name'}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'cvv'} label={'Cvv'}>
                                    <Input placeholder="Cvv" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'lastname'} label={'Last Name'}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
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

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item className={'mb-0'}>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Save
                                    </Button>
                                </Item>
                                <Item className={'mb-0'}>
                                    <Button danger className={'w-32'}>
                                        Cancel
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

export default AddPaymentInfo;