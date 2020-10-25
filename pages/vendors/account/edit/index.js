import React, { useState } from 'react';
import {Row, Col, Steps, Form, Input, Select, TimePicker, Upload, Checkbox, Divider, Grid, Button, message} from "antd";

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import Link from "next/link";
import GoogleMap from "../../../../components/Map";
import PolygonMap from "../../../../components/Map/PolygonMap";


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


const EditAccount = props => {
    const [imageUrl, setImageUrl] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [marker, setMarker] = useState({ position: {}})

    const [step, setStep] = useState(0)
    const screens = Grid.useBreakpoint();

    const breadcrumb = [
        {
            title: 'Vendor Profile',
            href: routes.vendors.account.index,
        },
        {
            title: 'Add/Edit Info',
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

    return (
        <Page title={'Account Info'} breadcrumb={breadcrumb}>
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
                        <Form layout={'vertical'}>
                            <Row gutter={24} className={'flex flex-row flex-wrap items-center'}>
                                <Col xs={24} md={12} lg={8}>
                                    <Item name={'email'} label={'Email Address'}>
                                        <Input placeholder={'Email Address'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Item name={'phone'} label={'Phone Number'}>
                                        <Input placeholder={'Phone Number'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Item name={'contract'} label={'Main Contract Name'}>
                                        <Input placeholder={'Main Contract Name'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Item name={'email'} label={'Email Address'}>
                                        <Input placeholder={'Email Address'}/>
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
                                    <Divider className={'py-2'}/>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'openTime'} label={'Store Open Time'}>
                                        <TimePicker className={'w-full'}/>
                                    </Item>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'closeTime'} label={'Store Close Time'}>
                                        <TimePicker className={'w-full'}/>
                                    </Item>
                                </Col>

                                <Col xs={24} md={12} lg={8}>
                                    <Item name={'name'} label={'Store Name'}>
                                        <Input placeholder={'Store Name'}/>
                                    </Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Row gutter={24}>
                                        <Col xs={12}>
                                            <Item name={'type'} label={'Type'}>
                                                <Select placeholder={'Type/Service'}>
                                                    {[...Array(10)].map((type, index) => {
                                                        return (
                                                            <Option value={`type-${index}`}>Type {index}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Item>
                                        </Col>
                                        <Col xs={12}>
                                            <Item name={'subType'} label={'Sub Type'}>
                                                <Select placeholder={'Sub Type'}>
                                                    {[...Array(20)].map((subType, index) => {
                                                        return (
                                                            <Option value={`subType-${index}`}>Sub Type {index}</Option>
                                                        )
                                                    })}
                                                </Select>
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
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                                        <Button type="primary" block className={'w-32 ml-5'} onClick={setStep.bind(this, 1)}>
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
                        <Form layout={'vertical'}>
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

                                <Col span={24}>
                                    <Item name={'storeDescription'} label={'Store Description'}>
                                        <Input.TextArea placeholder={'Store Description'} autoSize={{ minRows: 4, maxRows: 9 }}/>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <Item name={'needDriver'}>
                                        <Checkbox>I need driver to gather for us</Checkbox>
                                    </Item>
                                </Col>

                                <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                    <Item>
                                        <Button type="primary" block className={'w-32 ml-5'} onClick={setStep.bind(this, 2)}>
                                            Next
                                        </Button>
                                    </Item>

                                    <Item>
                                        <Button danger className={'w-32'} onClick={setStep.bind(this, 0)}>
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
                                    clickHandler={console.log}
                                />
                            </Col>

                            <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                <Link href={routes.vendors.account.index}>
                                    <Button type="primary" block className={'w-32 ml-5'}>
                                        Save
                                    </Button>
                                </Link>

                                <Item>
                                    <Button danger className={'w-32'} onClick={setStep.bind(this, 1)}>
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

export default EditAccount;