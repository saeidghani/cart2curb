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
import {useAuth} from "../../providers/AuthProvider";
import withoutAuth from "../../components/hoc/withoutAuth";
import {useCities, useProvinces} from "../../hooks/region";
import AccountInfo from "../../components/SignUpCompleteInfo";
import cookie from "cookie";
import {getStore} from "../../states";
import userTypes from "../../constants/userTypes";
import {defaultMapLocation} from "../../constants";
import {useGeocoding} from "../../hooks/geocoding";

const { Item } = Form;
const { Option } = Select;

const SignUp = props => {
    const [marker, setMarker] = useState({ position: {}})
    const [province, setProvince] = useState('');
    const [completeStep, setCompleteStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { setAuthenticated, setUserType } = useAuth();
    const provinces = useProvinces();
    const cities = useCities(province);
    const [geoCode, getGeoCode] = useGeocoding()

    const breadcrumb = [
        {
            title: 'Register'
        }
    ]
    const {profile, token} = props;

    useEffect(() => {
        form.setFieldsValue({
            province: 'ON'
        });
        setProvince('ON');
    }, []);

    useEffect(() => {

        form.setFieldsValue({
            firstName: profile.firstName || undefined,
            lastName: profile.lastName || undefined,
            email: profile.email || undefined,
            phone: profile.phone || undefined,
        })
    }, [props.profile])

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
            setLoading(true);
            const { firstName, lastName, phone, province, city, addressLine1, addressLine2, postalCode} = values;
            const body = {
                // @todo: add email and password
                profile: {
                    firstName, lastName, phone,
                },
                address: {
                    country: 'Canada',
                    province: provinces[province],
                    city,
                    addressLine1,
                    addressLine2,
                    postalCode,
                    location: {
                        type: 'Point',
                        coordinates: [marker.position.lng, marker.position.lat]
                    }
                },
                token
            }

            const result = await dispatch.auth.registerFromSocials(body)
            if(result) {
                setAuthenticated(true);
                setUserType('customer')
                setCompleteStep(true);
            }
            setLoading(false);
        } else {
            message.error('Please Select you Position on Map', 5)
        }
    }

    const checkRegistration = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const onChangePostal = (e) => {
        const value = e.target.value.toUpperCase()
        getGeoCode(value)
        form.setFieldsValue({
            postalCode: value
        })
    }
    return completeStep ? (
        <AccountInfo/>
    ) : (
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
                                            min: 1,
                                            message: "First name should be more than 1 characters."
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
                                            min: 1,
                                            message: "Last name should be more than 1 characters."
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
                                    <Input type='email' placeholder="Email Address" disabled={profile.hasOwnProperty('email') && profile.email.length > 0}/>
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
                                      label={'Confirm Password'}
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
                                    <Input.Password placeholder="Confirm Password"/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider className={'my-2'}/>
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
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder={'Select'}
                                        onChange={setProvince}
                                    >
                                        {Object.keys(provinces).map(abbr => {
                                            return (
                                                <Option value={abbr}>{provinces[abbr]}</Option>
                                            )
                                        })}
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'city'} label={'City'}
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please Select City'
                                          }
                                      ]}>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder={province ? 'Select' : 'Select Province first'}
                                    >
                                        {cities.map(city => {
                                            return (
                                                <Option value={city[0]}>{city[0]}</Option>
                                            )
                                        })}
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
                                    <Input.TextArea placeholder={'Address Line 1'} autoSize={{minRows: 1, maxRows: 6}} style={{ minHeight: 40, resize: 'none'}}/>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <Item name={'addressLine2'} label={'Address Line 2'}>
                                    <Input.TextArea placeholder={'Address Line 2'} autoSize={{minRows: 1, maxRows: 6}} style={{ minHeight: 40, resize: 'none'}}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'postalCode'} label={'Postal Code'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Please enter Postal Code."
                                          },
                                          ({ getFieldValue }) => ({
                                              validator(_, value) {
                                                  if (/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/.test(value)) {
                                                      return Promise.resolve();
                                                  }
                                                  return Promise.reject('Please enter valid Postal code');
                                              },
                                          }),
                                      ]}>
                                    <Input placeholder={'Postal Code'} onChange={onChangePostal}/>
                                </Item>
                            </Col>


                            <Col span={24}>
                                <div className="mb-8 mt-6">
                                    <GoogleMap
                                        height={670}
                                        initialCenter={defaultMapLocation}
                                        center={geoCode}
                                        marker={marker}
                                        clickHandler={changeMarkerPosition}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} className={'flex items-center justify-end'}>
                                <Item className={'w-full md:w-32'}>
                                    <Button type="primary" htmlType={'submit'} block className={'w-full md:w-32'} loading={loading}>
                                        Register
                                    </Button>
                                </Item>
                            </Col>
                        </Row>

                    </Form>
                    <div className="flex flex-row text-center items-center justify-center pt-8">
                        <span className="font-medium text-secondary text-base">Already a member?</span>
                        <Link href={routes.auth.login}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base">Login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    );
}

export async function getServerSideProps({ req, res, query, params }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let type = cookies.type;

    let profile = {};
    if(token) {
        res.writeHead(307, { Location: userTypes[type]['profile'] });
        res.end();
        return {
            props: {
                profile
            }
        }
    }
    if(!['google', 'facebook'].includes(params.provider)) {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        }
    }
    if(['customer', 'role'].includes(query.role) || !query.token) {
        let store = getStore();
        if(query.role === 'driver') {
            // @todo: implement driver user
            res.writeHead(307, { Location: routes.homepage });
            res.end();
            return {
                props: {
                    profile
                }
            }
        } else {
            let response = await store.dispatch.profile.getProfile({
                headers: {
                    Authorization: `Bearer ${query.token}`
                }
            })

            if(response) {
                profile = response;
                return {
                    props: {
                        profile,
                        token: query.token,
                    }
                }
            } else {
                res.writeHead(307, { Location: routes.auth.login });
                res.end();
                return {
                    props: {
                        profile
                    }
                }
            }
        }
    } else {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        }
    }
    // userTypes[type]['profile']
}


export default SignUp;
