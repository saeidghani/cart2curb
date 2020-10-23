import React, { useState } from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select
} from 'antd';
import Link from 'next/link';

import Page from '../../components/Page';
import GoogleMap from "../../components/Map";
import routes from "../../constants/routes";

const { Item } = Form;
const { Option } = Select;

const SignUp = props => {
    const [marker, setMarker] = useState({ position: {}})
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: 'Register'
        }
    ]

    const changeMarkerPosition = (e, map, position) => {
        const newPosition = {
            lat: position.latLng.lat(),
            lng: position.latLng.lng()
        }
        setMarker({
            position: newPosition
        });
    }

    return (
        <Page title={'Register'} breadcrumb={breadcrumb}>
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
                                <Item name={'password'}
                                      label={'Password'}
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please input your password!',
                                          },
                                      ]}
                                      hasFeedback
                                >
                                    <Input.Password placeholder="Password" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'password-confirm'}
                                      label={'Password Confirm'}
                                      dependencies={['password']}
                                      hasFeedback
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please confirm your password!',
                                          },
                                          ({ getFieldValue }) => ({
                                              validator(rule, value) {
                                                  if (!value || getFieldValue('password') === value) {
                                                      return Promise.resolve();
                                                  }
                                                  return Promise.reject('The two passwords that you entered do not match!');
                                              },
                                          }),
                                      ]}
                                >
                                    <Input.Password placeholder="Password Confirm" />
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider />
                            </Col>

                            <Col span={24}>
                                <div className="mb-6">
                                    <GoogleMap
                                        height={670}
                                        initialCenter={{
                                            lat: 40.781305,
                                            lng: -73.9666857
                                        }}
                                        marker={marker}
                                        clickHandler={changeMarkerPosition}
                                    />
                                </div>
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
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} className={'flex items-center justify-end'}>
                                <Item>
                                    <Button type="primary" block className={'w-32'}>
                                        Register
                                    </Button>
                                </Item>
                            </Col>
                        </Row>

                    </Form>
                    <div className="flex flex-row text-center items-center justify-center pt-14">
                        <h4 className="font-medium text-secondary text-base">Already a member?</h4>
                        <Link href={routes.auth.login}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base">Login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default SignUp;