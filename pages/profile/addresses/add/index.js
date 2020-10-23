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

import Page from '../../../../components/Page';
import GoogleMap from "../../../../components/Map";
import routes from "../../../../constants/routes";
import {LocationIcon} from "../../../../components/icons";

const { Item } = Form;
const { Option } = Select;

const SignUp = props => {
    const [marker, setMarker] = useState({ position: {}})
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: "Addresses",
            href: routes.profile.addresses.index
        },
        {
            title: 'Add New'
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
        <Page title={'Add New Address'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
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
                                <Item name={'address-line2'} label={'Address Line 2'}>
                                    <Input.TextArea placeholder={'Address Line 2'} autoSize={{ minRows: 1, maxRows: 6 }}/>
                                </Item>
                            </Col>
                            <Col span={24} className={'md:pt-14 pt-4'}>
                                <Button
                                    className={'text-info hover:text-teal-500 font-medium flex items-center'}
                                    type={'text'}
                                    icon={(
                                        <div className="inline-flex mr-2">
                                            <LocationIcon size={20} fill={'#40BFC1'}/>
                                        </div>
                                    )}
                                >Find Me on Map</Button>
                                <Divider className={'mt-1 mb-8'}/>
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

                            <Col xs={24} className={'flex items-center flex-row-reverse md:pt-16 pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Save
                                    </Button>
                                </Item>
                                <Item>
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

export default SignUp;