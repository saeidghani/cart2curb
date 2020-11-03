import React, { useState } from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select, message
} from 'antd';
import Link from 'next/link';

import Page from '../../../../components/Page';
import GoogleMap from "../../../../components/Map";
import routes from "../../../../constants/routes";
import {LocationIcon} from "../../../../components/icons";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import cookie from "cookie";
import {getStore} from "../../../../states";
import withAuth from "../../../../components/hoc/withAuth";
import {useCities, useProvinces} from "../../../../hooks/region";

const { Item } = Form;
const { Option } = Select;

const AddAddress = props => {
    const [marker, setMarker] = useState({ position: {}})
    const [center, setCenter] = useState({
        lat: 40.781305,
        lng: -73.9666857
    })
    const [province, setProvince] = useState('');
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.profile.addAddress)
    const dispatch = useDispatch();
    const router = useRouter();
    const provinces = useProvinces();
    const cities = useCities(province);

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

    const submitHandler = async (values) => {
        if(marker.position.hasOwnProperty('lat')) {
            const { province, city, addressLine1, addressLine2, postalCode} = values;
            const body = {
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
            }

            const result = await dispatch.profile.addAddress(body)
            if(result) {
                router.push(routes.profile.addresses.index);
            }
        } else {
            message.error('Please Select you Position on Map', 5)
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const findGeoLocationHandler = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                setMarker({
                    position: pos
                })
                setCenter(pos);
            }, (e) => {
                if(e.code === 2) {
                    message.error('Your device doesn\'t support this feature')
                } else if(e.code === 1) {
                    message.error('You not allowed this service to find your location')
                }
                console.log(e);
            });
        } else {
            message.error('Your device doesn\'t support this feature or you not allowed')
        }
    }

    return (
        <Page title={'Add New Address'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'province'} label={'Province'}
                                      rules={[{
                                          required: true,
                                          message: 'Please select Province'
                                      }]}>
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
                                              message: "Address Line 1 is required"
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

                            <Col span={24} className={'md:pt-8 pt-4'}>
                                <Button
                                    className={'text-info hover:text-teal-500 font-medium flex items-center px-0'}
                                    type={'link'}
                                    icon={(
                                        <div className="inline-flex mr-2">
                                            <LocationIcon size={20} fill={'#40BFC1'}/>
                                        </div>
                                    )}
                                    onClick={findGeoLocationHandler}
                                >Find Me on Map</Button>
                                <Divider className={'mt-1 mb-8'}/>
                            </Col>

                            <Col span={24}>
                                <div className="mb-6">
                                    <GoogleMap
                                        height={670}
                                        center={center}
                                        marker={marker}
                                        clickHandler={changeMarkerPosition}
                                    />
                                </div>
                            </Col>

                            <Col xs={24} className={'flex md:items-center flex-col md:flex-row-reverse md:pt-16 pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-full md:w-32 md:ml-5 ml-0'} htmlType={'submit'} loading={loading}>
                                        Save
                                    </Button>
                                </Item>
                                <Item>
                                    <Link href={routes.profile.addresses.index}>
                                        <Button danger className={'w-full md:w-32'}>
                                            Cancel
                                        </Button>
                                    </Link>
                                </Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>
        </Page>
    )
}


export default withAuth(AddAddress, 'customer');