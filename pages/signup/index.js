import React, {useState, useEffect } from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select,
    message
} from 'antd';
import Link from 'next/link';

import Page from '../../components/Page';
import GoogleMap from "../../components/Map";
import routes from "../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectAuthenticated} from "../../hooks/auth";
import {useAuth} from "../../providers/AuthProvider";
import withoutAuth from "../../components/hoc/withoutAuth";

const { Item } = Form;
const { Option } = Select;

const SignUp = props => {
    const [marker, setMarker] = useState({ position: {}})
    const loading = useSelector(state => state.loading.effects.auth.register);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { setAuthenticated } = useAuth();

    const redirect = useRedirectAuthenticated();

    useEffect(() => {
        redirect();
    }, [redirect])


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

    const submitRegistration = async (values) => {
        if(marker.position.hasOwnProperty('lat')) {
            const { firstName, lastName, email, phone, password, province, city, addressLine1, addressLine2, postalCode} = values;
            const body = {
                firstName, lastName, email, phone, password,
                address: {
                    country: 'Canada', // @todo: change region form,
                    province,
                    city,
                    addressLine1,
                    addressLine2,
                    postalCode,
                    location: {
                        type: 'Point',
                        coordinates: [marker.position.lat, marker.position.lng]
                    }
                }

            }

            const result = await dispatch.auth.register(body)
            if(result) {
                setAuthenticated(true);
            }
        } else {
            message.error('Please Select you Position on Map', 5)
        }
    }

    const checkRegistration = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


    return (
        <Page title={'Register'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        onFinish={submitRegistration}
                        onFinishFailed={checkRegistration}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'firstName'}
                                    label={'First Name'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter you first name"
                                        },
                                        {
                                            min: 3,
                                            message: "First name should be more than 3 characters."
                                        }
                                    ]}>
                                    <Input placeholder="First Name"/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'lastName'}
                                    label={'Last Name'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter you last name"
                                        },
                                        {
                                            min: 3,
                                            message: "Last name should be more than 3 characters."
                                        }
                                    ]}
                                >
                                    <Input placeholder="Last Name"/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'email'}
                                    label={'Email Address'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Email Field is required"
                                        },
                                        {
                                            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                            message: "Please enter valid Email Address"
                                        }
                                    ]}
                                >
                                    <Input type='email' placeholder="Email Address"/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'phone'}
                                    label={'Phone Number'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Phone Number field is required"
                                        },
                                        {
                                            pattern: /^[1-9][0-9]*$/,
                                            message: "Your Entered Phone number is not valid"
                                        }
                                    ]}
                                >
                                    <Input placeholder="Phone Number"/>
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
                                          {
                                              min: 6,
                                              message: "Password should be at least 6 character"
                                          }
                                      ]}
                                      hasFeedback
                                >
                                    <Input.Password placeholder="Password"/>
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
                                          ({getFieldValue}) => ({
                                              validator(rule, value) {
                                                  if (!value || getFieldValue('password') === value) {
                                                      return Promise.resolve();
                                                  }
                                                  return Promise.reject('The two passwords that you entered do not match!');
                                              },
                                          }),
                                      ]}
                                >
                                    <Input.Password placeholder="Password Confirm"/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider/>
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
                                <Item
                                    name={'province'}
                                    label={'Province'}
                                    rules={[{
                                        required: true,
                                        message: 'Please select Province'
                                    }]}
                                >
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
                                <Item
                                    name={'city'}
                                    label={'City'}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Select City'
                                        }
                                    ]}
                                >
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
                                <Item
                                    name={'addressLine1'}
                                    label={'Address Line 1'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Address Line 1 is required"
                                        }
                                    ]}
                                >
                                    <Input.TextArea placeholder={'Address Line 1'} autoSize={{minRows: 1, maxRows: 6}}/>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <Item name={'addressLine2'} label={'Address Line 2'}>
                                    <Input.TextArea placeholder={'Address Line 2'} autoSize={{minRows: 1, maxRows: 6}}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'postalCode'} label={'Postal Code'}
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
                                    <Button type="primary" htmlType={'submit'} block className={'w-32'} loading={loading}>
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
    );
}

export default withoutAuth(SignUp);