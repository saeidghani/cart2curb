import React, { useState } from 'react';
import {Row, Col, Steps, Form, Input, Select, TimePicker, Upload, Checkbox, Divider, Grid, Button, message} from "antd";

import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import Link from "next/link";
import GoogleMap from "../../../components/Map";
import PolygonMap from "../../../components/Map/PolygonMap";
import {useDispatch, useSelector} from "react-redux";
import {useCities, useProvinces} from "../../../hooks/region";
import {useRouter} from "next/router";
import withoutAuth from "../../../components/hoc/withoutAuth";


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

// @todo: internal server error should be correct
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
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                handler(imageUrl);
            });
        }
    };

    const addStepHandler = (values, step) => {
        if(step === 1 && !marker.position.hasOwnProperty('lat')) {
            message.error('Please Select Your Location on Map')
        } else {
            const newFields = [...fields];
            newFields[step] = values;
            setFields(newFields)
            setStep(step + 1);
        }
    }

    const prevHandler = (step) => {
        form.setFieldsValue(fields[step - 1]);
        setStep(step - 1);
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const addPointToAreaHandler = (newPoly) => {
        setArea(newPoly);
    }

    const submitHandler = async () => {
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
                coordinates: [marker.position.lat, marker.position.lng]
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
                coordinates: [area.map(point => [point.lat, point.lng])],
            },
            image: "https://some.url/pic/name", // @todo: change to server mode
            needDriversToGather: form2.needDriversToGather.includes('true'),
            storeType: form1.storeType,
            subType: form1.subType,
        }

        const vendor = {
            email: form1.email,
            phone: form1.phone,
            contactName: form1.contactName,
            image: "http://some.url/pic/name", // @todo: change to server mode
            password: form1.password
        }

        const body = {
            vendor,
            store,
        }

        const result = await dispatch.vendorAuth.register(body);

        if(result) {
            router.push(routes.vendors.auth.register.submitted);
        }

    }

    return (
        <Page title={'Register'} breadcrumb={breadcrumb}>
            <Row>
                <Col xs={24} xl={{ span: 14, offset: 5}} lg={{ span: 18, offset: 3}}>
                    <Steps current={step} direction={screens.lg ? 'horizontal' : 'vertical'}>
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
                                    <Item name={'passwordConfirm'}
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
                                    <Divider className={'py-2'}/>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'openingHour'} label={'Store Open Time'}
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
                                    <Item name={'closingHour'} label={'Store Close Time'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: "Store Close Time field is required"
                                              },
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
                                                    <Option value={'service'}>Service</Option>
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
                                        <Upload
                                            name="storeImage"
                                            listType="picture-card"
                                            className="avatar-uploader-square"
                                            showUploadList={false}
                                            headers={{
                                                Authorization: `Bearer ${token}`
                                            }}
                                            action="http://165.227.34.172:3003/api/v1/files/photos/"
                                            beforeUpload={beforeUpload}
                                            onChange={(info) => handleChange(info, setImageUrl)}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 70, height: 70 }} /> : (
                                                <>
                                                    <div className={'full-rounded text-primary flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>+</div>
                                                </>
                                            )}
                                        </Upload>
                                        <label htmlFor={'avatar'} className="text-secondarey ml-3">Upload Your Store Image</label>
                                    </div>
                                </Col>

                                <Col lg={8} md={12} xs={24}>
                                    <div className={'flex items-center justify-start pt-6'}>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            headers={{
                                                Authorization: `Bearer ${token}`
                                            }}
                                            action="http://165.227.34.172:3003/api/v1/files/photos/"
                                            beforeUpload={beforeUpload}
                                            onChange={(info) => handleChange(info, setAvatarUrl)}
                                        >
                                            {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: 70, height: 70 }} /> : (
                                                <>
                                                    <div className={'full-rounded text-primary flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>+</div>
                                                </>
                                            )}
                                        </Upload>
                                        <label htmlFor={'avatar'} className="text-secondarey ml-3">Upload Your Profile Image</label>
                                    </div>
                                </Col>

                                <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                    <Item>
                                        <Button type="primary" block className={'w-32 ml-5'} htmlType={'submit'} >
                                            Next
                                        </Button>
                                    </Item>
                                    <Link href={routes.vendors.account.index}>
                                        <Button danger className={'w-32'}>Cancel</Button>
                                    </Link>
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
                                        <Input.TextArea placeholder={'Address Line 1'} autoSize={{ minRows: 1, maxRows: 6 }}/>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <Item name={'addressLine2'} label={'Address Line 2'}>
                                        <Input.TextArea placeholder={'Address Line 2'} autoSize={{ minRows: 1, maxRows: 6 }}/>
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
                                        <Input.TextArea placeholder={'Store Description'} autoSize={{ minRows: 4, maxRows: 9 }}/>
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
                                    clickHandler={addPointToAreaHandler}
                                />
                            </Col>

                            <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                <Button type="primary" block className={'w-32 ml-5'} onClick={submitHandler} loading={loading}>
                                    Save
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
        </Page>
    )
}

export default withoutAuth(Register);