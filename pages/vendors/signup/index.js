import React, { useState } from 'react';
import {Row, Col, Form, Input, Select, Button, message} from "antd";

import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import withoutAuth from "../../../components/hoc/withoutAuth";
import Submitted from "../../../components/Submitted";
import {isPointInside} from "../../../helpers";

const { Item } = Form;
const { Option } = Select;

const Register = props => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('')
    const [area, setArea] = useState([]);
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const loading = useSelector(state => state.loading.effects.vendorAuth.register);

    const breadcrumb = [
        {
            title: 'Register',
        }
    ]


    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const submitHandler = async (values) => {
        const { email, phone, contactName, subType, storeType, name, webpage, password } = values;
        const store = {
            name,
            webpage,
            storeType,
            subType,
        }

        const vendor = {
            email,
            phone,
            contactName,
            password,
        }

        const body = {
            vendor,
            store,
        }

        const result = await dispatch.vendorAuth.register(body);

        if(result) {
            setSubmitted(true)
            scrollToTop();
        }

    }


    const scrollToTop = () => {
        const yScroll = window.scrollY;
        window.scrollTo(0, yScroll * 0.9);

        if(window.scrollY > 5) {
            requestAnimationFrame(scrollToTop);
        }
    }


    return (
        <Page title={submitted ? false : 'Register'} breadcrumb={submitted ? [] : breadcrumb}>
            {submitted ? (
                <Submitted href={routes.vendors.auth.login} content={'Thanks for submitting, we will review your application and get in touch in 48 hours!'}/>
            ) : (
            <Row>
                <Col xs={24} className={'pt-8'}>
                    <Form layout={'vertical'} form={form} onFinish={submitHandler} onFinishFailed={checkValidation}>
                        <Row gutter={24} className={'flex flex-row flex-wrap items-center'}>


                            <Col xs={24} md={12} lg={8}>
                                <Item name={'name'} label={'Store Name'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Store Name field is required"
                                          },
                                      ]}>
                                    <Input placeholder={'Store Name'}/>
                                </Item>
                            </Col>

                            <Col xs={24} md={12} lg={8}>
                                <Item name={'contactName'} label={'Main Contact Name'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Main Contact Name is required"
                                          },
                                      ]}>
                                    <Input placeholder={'Main Contact Name'}/>
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Item name={'phone'} label={'Phone Number'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Phone Number field is required"
                                          },
                                          {
                                              pattern: /^[1-9][0-9]*$/,
                                              message: "Your Entered Phone number is not valid"
                                          },
                                          {
                                              min: 3,
                                              message: "Phone Number should be more than 3 digits"
                                          },
                                          {
                                              max: 14,
                                              message: "Phone Number should be less than 14 digits"
                                          }
                                      ]}>
                                    <Input placeholder={'Phone Number'}/>
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Item name={'email'} label={'Email Address'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Email Field is required"
                                          },
                                          {
                                              pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                              message: "Please enter valid Email Address"
                                          }
                                      ]}>
                                    <Input placeholder={'Email Address'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'password'}
                                      label={'Password'}
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please enter your password!',
                                          },
                                          {
                                              min: 6,
                                              message: "Password should be at least 6 character"
                                          }
                                      ]}
                                      hasFeedback
                                >
                                    <Input.Password placeholder="Password" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'confirmPassword'}
                                      label={'Confirm Password'}
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
                                    <Input.Password placeholder="Confirm Password" />
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Item name={'webpage'} label={'Webpage'}>
                                    <Input placeholder={'Webpage'}/>
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Row gutter={24}>
                                    <Col xs={12}>
                                        <Item name={'storeType'} label={'Type'}
                                              rules={[
                                                  {
                                                      required: true,
                                                      message: "Type field is required"
                                                  },
                                              ]}>
                                            <Select placeholder={'Type/Service'}>
                                                <Option value={'product'}>Product</Option>
                                                <Option value={'service'} disabled>Service</Option>
                                            </Select>
                                        </Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Item name={'subType'} label={'Description of store'}
                                              rules={[
                                                  {
                                                      required: true,
                                                      message: "Description of store field is required"
                                                  },
                                              ]}>
                                            <Input placeholder={'Description of store'}/>
                                        </Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                <Button type="primary" htmlType={"submit"} block className={'w-32 ml-5'} loading={loading}>
                                    Register
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            )}
        </Page>
    )
}

export default withoutAuth(Register, 'vendor');