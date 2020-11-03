import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select, DatePicker
} from 'antd';

import Page from '../../../components/Page';

const { Item } = Form;
const { Option } = Select;

const CartGuest = props => {
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
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'firstname'} label={'First Name'}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'lastname'} label={'Last Name'}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'email'} label={'Email Address'}>
                                    <Input type='email' placeholder="Email Address" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'phone'} label={'Phone Number'}>
                                    <Input placeholder="Phone Number" />
                                </Item>
                            </Col>


                            <Col lg={8} md={12} xs={24}>
                                <Item name={'stream-preference'} label={'Stream Preference'}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'skype'}>Skype</Option>
                                        <Option value={'whatsapp'}>Whatsapp</Option>
                                        <Option value={'telegram'}>Telegram</Option>
                                        <Option value={'twitter'}>Twitter</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'id'} label={'Skype ID'}>
                                    <Input placeholder="Skype ID" />
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'birthday'} label={'Birthday'}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider />
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'province'} label={'Province'}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'nyc'}>NYC</Option>
                                        <Option value={'california'}>California</Option>
                                        <Option value={'washington'}>Washington DC</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'city'} label={'City'}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'nyc'}>NYC</Option>
                                        <Option value={'california'}>California</Option>
                                        <Option value={'washington'}>Washington DC</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <Item name={'address-line1'} label={'Address Line 1'}>
                                    <Input.TextArea placeholder={'Address Line 1'} autoSize={{ minRows: 1, maxRows: 6 }} style={{ resize: 'none' }}/>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <Item name={'address-line2'} label={'Address Line 2'}>
                                    <Input.TextArea placeholder={'Address Line 2'} autoSize={{ minRows: 1, maxRows: 6 }} style={{ resize: 'none' }}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'postal-code'} label={'Postal Code'}
                                      rules={[
                                          {
                                              len: 5,
                                              message: 'Postal Code Should be 5 characters',
                                          },
                                          {
                                              required: true,
                                              message: "Please enter Postal Code."
                                          }
                                      ]}>
                                    <Input placeholder={'Postal Code'}/>
                                </Item>
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

export default CartGuest;