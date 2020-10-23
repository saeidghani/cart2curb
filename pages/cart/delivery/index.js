import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select,
    DatePicker,
    TimePicker,
    Radio
} from 'antd';

import Page from '../../../components/Page';

const { Item } = Form;
const { Option } = Select;

const Delivery = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Delivery'
        }
    ]

    return (
        <Page title={'Delivery Time & Checkout'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'date'} label={'Delivery Date'}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'time'} label={'Delivery Time'}>
                                    <TimePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Item name={'address'} label={'Address'} className={'mb-0'}>
                                    <Radio.Group className={'flex flex-col'}>
                                        <Radio value={1} className={'py-2'}>Address Line 2, Address Line 1, City, State, Country, Zip Code</Radio>
                                        <Radio value={2} className={'py-2'}>Address Line 2, Address Line 1, City, State, Country, Zip Code</Radio>
                                        <Radio value={3} className={'py-2'}>Address Line 2, Address Line 1, City, State, Country, Zip Code</Radio>
                                        <Radio value={4} className={'py-2'}>Address Line 2, Address Line 1, City, State, Country, Zip Code</Radio>
                                    </Radio.Group>
                                </Item>
                            </Col>

                            <div className="w-full px-3">
                                <Divider className={'my-8'}/>
                            </div>

                            <Col xs={24}>
                                <h3 className="text-type font-medium text-base mb-8">Or Add New Address</h3>
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
                                    <Input.TextArea placeholder={'Address Line 1'} autoSize={{ minRows: 1, maxRows: 6 }}/>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <Item name={'address-line2'} label={'Address Line 2'}>
                                    <Input.TextArea placeholder={'Address Line 2'} autoSize={{ minRows: 1, maxRows: 6 }}/>
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

export default Delivery;