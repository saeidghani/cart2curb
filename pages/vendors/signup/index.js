import React, { useState } from 'react';
import {Row, Col, Steps, Form, Input, Select, TimePicker, Upload, Checkbox, Divider, Grid, Button, message} from "antd";
import { PictureOutlined, UserOutlined } from '@ant-design/icons';

import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import Link from "next/link";
import GoogleMap from "../../../components/Map";
import PolygonMap from "../../../components/Map/PolygonMap";
import {useDispatch, useSelector} from "react-redux";
import {useCities, useProvinces} from "../../../hooks/region";
import {useRouter} from "next/router";
import withoutAuth from "../../../components/hoc/withoutAuth";
import Submitted from "../../../components/Submitted";
import ImgCrop from "antd-img-crop";
import {isPointInside} from "../../../helpers";


const { Step } = Steps;
const { Item } = Form;
const { Option } = Select;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

const Register = props => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [marker, setMarker] = useState({ position: {}})
    const [area, setArea] = useState([]);
    const [province, setProvince] = useState('');
    const token = useSelector(state => state.vendorAuth.token);
    const [step, setStep] = useState(0)
    const screens = Grid.useBreakpoint();
    const provinces = useProvinces();
    const cities = useCities(province);
    const dispatch = useDispatch();
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [lastReached, setLastReached] = useState(0);
    const loading = useSelector(state => state.loading.effects.vendorAuth.register);

    const breadcrumb = [
        {
            title: 'Register',
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

    const handleChange = (info, handler) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            handler(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const addStepHandler = (values, step) => {
        if(step === 1 && !marker.position.hasOwnProperty('lat')) {
            message.error('Please Select Your Location on Map')
        } else if(step === 0 && (!imageUrl || !avatarUrl)) {
            message.error('Please upload your store and profile image first');
        } else {
            const newFields = [...fields];
            newFields[step] = values;
            setFields(newFields)
            setStep(step + 1);
            setLastReached(step + 1);
            scrollToTop();
        }
    }

    const prevHandler = (step) => {
        form.setFieldsValue(fields[step - 1]);
        setStep(step - 1);
        scrollToTop();
    }

    const jumpHandler = (newStep) => {
        if(newStep <= lastReached) {
            setStep(newStep);
            scrollToTop();
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const addPointToAreaHandler = (newPoly) => {
        setArea(newPoly);
    }

    const submitHandler = async () => {
        if(area.length === 0) {
            message.error("Please Select Your Service Radius")
            return;
        }
        let isInside = isPointInside([marker.position.lng, marker.position.lat], area.map(point => [point.lng, point.lat]));
        if(!isInside) {
            message.error('Your Store location must be in your service radius');
            return;
        }
        const [form1, form2] = fields;
        const address = {
            country: 'Canada',
            province: form2.province,
            city: form2.city,
            addressLine1: form2.addressLine1,
            addressLine2: form2.addressLine2,
            postalCode: form2.postalCode,
            location: {
                type: 'Point',
                coordinates: [marker.position.lng, marker.position.lat]
            }
        }
        const store = {
            address,
            description: form2.description,
            openingHour: form1.openingHour.toISOString(),
            closingHour: form1.closingHour.toISOString(),
            name: form1.name,
            area: {
                type: 'Polygon',
                coordinates: [area.map(point => [point.lng, point.lat]).concat([[area[0].lng, area[0].lat]])],
            },
            image: imageUrl,
            needDriversToGather: form2.needDriversToGather && form2.needDriversToGather.includes('true'),
            storeType: form1.storeType,
            subType: form1.subType,
        }

        const vendor = {
            email: form1.email,
            phone: form1.phone,
            contactName: form1.contactName,
            image: avatarUrl,
            password: form1.password
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
                <Col xs={24} xl={{ span: 14, offset: 5}} lg={{ span: 18, offset: 3}}>
                    <Steps current={step} direction={screens.lg ? 'horizontal' : 'vertical'} onChange={jumpHandler}>
                        <Step title="Store Info" description="Enter store info." />
                        <Step title="Store Addresses"  description="Enter store Adresses." />
                        <Step title="Service Area" description="Select service radius." />
                    </Steps>
                </Col>
                <Col xs={24} className={'pt-8'}>
                    {step === 0 ? (
                        <Form layout={'vertical'} form={form} onFinish={(values) => addStepHandler(values, 0)} onFinishFailed={checkValidation}>
                            <Row gutter={24} className={'flex flex-row flex-wrap items-center'}>
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
                                        <Input.Password placeholder="Password Confirm" />
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Divider className={'mt-0 mb-6'}/>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'openingHour'} label={'Store Opening Hour'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: "Store Open Time field is required"
                                              },
                                          ]}>
                                        <TimePicker className={'w-full'}/>
                                    </Item>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'closingHour'} label={'Store Closing Hour'}

                                          dependencies={['openingHour']}
                                          hasFeedback
                                          rules={[
                                              {
                                                  required: true,
                                                  message: "Store Close Time field is required",
                                              },
                                              ({ getFieldValue }) => ({
                                                  validator(rule, value) {
                                                      const openingHour = getFieldValue('openingHour');
                                                      if (!value || !openingHour || value.diff(openingHour) > 0) {
                                                          return Promise.resolve();
                                                      }
                                                      return Promise.reject('Closing Hour should be later than Opening Hour');
                                                  },
                                              }),
                                          ]}>
                                        <TimePicker className={'w-full'}/>
                                    </Item>
                                </Col>

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
                                            <Item name={'subType'} label={'Sub Type'}
                                                  rules={[
                                                      {
                                                          required: true,
                                                          message: "Sub Type field is required"
                                                      },
                                                  ]}>
                                                <Input placeholder={'Sub Type'}/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={8} md={12} xs={24}>
                                    <div className={'flex items-center justify-start pt-4'}>
                                        <ImgCrop>
                                            <Upload
                                                name="photo"
                                                listType="picture-card"
                                                className="border-0 avatar-uploader-square-wrapper"
                                                showUploadList={false}
                                                headers={{
                                                    Authorization: `Bearer ${token}`
                                                }}
                                                action="/v1/files/photos/"
                                                beforeUpload={beforeUpload}
                                                onChange={(info) => handleChange(info, setImageUrl)}
                                            >
                                                <div className="avatar-uploader-square">
                                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 70, height: 70 }} /> : (
                                                        <>
                                                            <div className={'full-rounded text-overline bg-card flex items-center justify-center'} style={{ width: 70, height: 70 }}>
                                                                <PictureOutlined className={'text-xl'} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <label htmlFor={'photo'} className="text-secondarey ml-3 cursor-pointer">Upload Your Store Image</label>
                                            </Upload>
                                        </ImgCrop>
                                    </div>
                                </Col>

                                <Col lg={8} md={12} xs={24}>
                                    <div className={'flex items-center justify-start pt-6'}>
                                        <ImgCrop>
                                            <Upload
                                                name="photo"
                                                listType="picture-card"
                                                className="avatar-uploader-wrapper border-0"
                                                showUploadList={false}
                                                headers={{
                                                    Authorization: `Bearer ${token}`
                                                }}
                                                action="/v1/files/photos/"
                                                beforeUpload={beforeUpload}
                                                onChange={(info) => handleChange(info, setAvatarUrl)}
                                            >
                                                <div className="avatar-uploader">
                                                    {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: 50, height: 50, borderRadius: 50 }} /> : (
                                                        <>
                                                            <div className={'full-rounded text-overline bg-card flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>
                                                                <UserOutlined className={'text-lg'}/>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <label htmlFor={'avatar'} className="text-secondarey ml-3 cursor-pointer">Upload Your Profile Image</label>

                                            </Upload>
                                        </ImgCrop>
                                    </div>
                                </Col>

                                <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                    <Item>
                                        <Button type="primary" block className={'w-32 ml-5'} htmlType={'submit'} >
                                            Next
                                        </Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    ) : step === 1 ? (
                        <Form layout={'vertical'} form={form} onFinish={(values) => addStepHandler(values, 1)} onFinishFailed={checkValidation}>
                            <Row gutter={24}>
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
                                    <Item name={'addressLine1'} label={'Address Line 1'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Address Line 1 is required'
                                              }
                                          ]}>
                                        <Input.TextArea placeholder={'Address Line 1'} autoSize={{ minRows: 1, maxRows: 6 }} style={{ resize: 'none' }}/>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <Item name={'addressLine2'} label={'Address Line 2'}>
                                        <Input.TextArea placeholder={'Address Line 2'} autoSize={{ minRows: 1, maxRows: 6 }} style={{ resize: 'none' }}/>
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

                                <Col span={24}>
                                    <Item name={'description'} label={'Store Description'}>
                                        <Input.TextArea placeholder={'Store Description'} autoSize={{ minRows: 4, maxRows: 9 }} style={{ resize: 'none' }}/>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <Item name={'needDriversToGather'}>
                                        <Checkbox.Group >
                                            <Checkbox value={'true'}>I need driver to gather for us</Checkbox>

                                        </Checkbox.Group>
                                    </Item>
                                </Col>

                                <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                    <Item>
                                        <Button type="primary" block className={'w-32 ml-5'} htmlType={'submit'}>
                                            Next
                                        </Button>
                                    </Item>

                                    <Item>
                                        <Button danger className={'w-32'} onClick={prevHandler.bind(this, 1)}>
                                            Prev
                                        </Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    ) : (
                        <Row gutter={24}>
                            <Col xs={24}>
                                <PolygonMap
                                    height={670}
                                    initialCenter={{
                                        lat: 40.781305,
                                        lng: -73.9666857
                                    }}
                                    area={area}
                                    marker={marker}
                                    clickHandler={addPointToAreaHandler}
                                />
                            </Col>

                            <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                <Button type="primary" block className={'w-32 ml-5'} onClick={submitHandler} loading={loading}>
                                    Register
                                </Button>
                                <Item>
                                    <Button danger className={'w-32'} onClick={prevHandler.bind(this, 2)}>
                                        Prev
                                    </Button>
                                </Item>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
            )}
        </Page>
    )
}

export default withoutAuth(Register, 'vendor');