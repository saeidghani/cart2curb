import React, {useState} from 'react';
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
    Radio, message
} from 'antd';

import Page from '../../../components/Page';
import cookie from "cookie";
import routes from "../../../constants/routes";
import {getStore} from "../../../states";
import GoogleMap from "../../../components/Map";
import {useCities, useProvinces} from "../../../hooks/region";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";

const { Item } = Form;
const { Option } = Select;

const Delivery = props => {
    const [form] = Form.useForm();
    const [newAddress, setNewAddress] = useState(false);
    const [province, setProvince] = useState('');
    const [marker, setMarker] = useState({ position: {}})
    const provinces = useProvinces();
    const cities = useCities(province);
    const dispatch = useDispatch();
    const router = useRouter();

    console.log(props);
    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Delivery'
        }
    ]

    const { addresses } = props;

    const changeMarkerPosition = (e, map, position) => {
        const newPosition = {
            lat: position.latLng.lat(),
            lng: position.latLng.lng()
        }
        setMarker({
            position: newPosition
        });
    }

    const changeAddressHandler = (e) => {
        if(e.target.value === 'new') {
            setNewAddress(true)
        } else {
            setNewAddress(false)
        }
    }

    const submitHandler = async (values) => {
        if(values.address === 'new' && !marker.position.hasOwnProperty('lat')) {
            message.error('Please select your location in map');
            return false;
        }
        const {date, time, address} = values;
        const deliveryTime = date.hours(time.hours()).minutes(time.minutes()).seconds(time.seconds());
        let transformedAddress;
        if(address === 'new') {
            const { province, city, addressLine1, addressLine2, postalCode} = values;

            transformedAddress = {
                country: 'Canada',
                province,
                city,
                addressLine1,
                addressLine2,
                postalCode,
                location: {
                    type: 'Point',
                    coordinates: [marker.position.lng, marker.position.lat]
                }
            }
        } else {
            const { country, province, city, addressLine1, addressLine2, postalCode, location} = addresses.find(item => item._id === address)
            transformedAddress = {
                country, province, city, addressLine1, addressLine2, postalCode, location
            };
        }

        // @todo: add check address logics here
        // const res = await dispatch.cart.checkAddress({
        //     ...transformedAddress
        // })
        // if(res) {
        //
        // } else {
        //     message.error('An Error was occurred');
        // }
        const body = {
            time: deliveryTime,
            address: transformedAddress
        }

        const res = await dispatch.cart.updateDelivery(body);
        if(res) {
            router.push(routes.cart.invoice.index);
        }
    }

    const checkValidation = errorInfo => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={'Delivery Time & Checkout'} breadcrumb={breadcrumb}>
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
                                <Item
                                    name={'date'}
                                    label={'Delivery Date'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "This Field is required"
                                        }
                                    ]}
                                >
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'time'}
                                    label={'Delivery Time'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "This Field is required"
                                        }
                                    ]}
                                >
                                    <TimePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Item
                                    name={'address'}
                                    label={'Address'}
                                    className={'mb-0'}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose an Address or Create new'
                                        }
                                    ]}
                                >
                                    <Radio.Group className={'flex flex-col'} onChange={changeAddressHandler}>
                                        {addresses.map(address => {

                                            const transformed = address.addressLine2 ? [address.addressLine2] : [];
                                            transformed.push(address.addressLine1);
                                            transformed.push(address.city);
                                            transformed.push(address.province);
                                            transformed.push(address.country);

                                            return (
                                                <Radio value={address._id} className={'py-2'}>{transformed.join(", ")}</Radio>
                                            )
                                        })}
                                        <div className="w-full">
                                            <Divider className={'my-6'}/>
                                        </div>
                                        <Radio value={'new'} className={'py-2'}>Or add a new address</Radio>
                                    </Radio.Group>
                                </Item>
                            </Col>
                            {newAddress && (
                                <>
                                    <div className="w-full px-3">
                                        <Divider className={'mt-6 mb-2'}/>
                                    </div>

                                    <Col span={24}>
                                        <div className="mb-8 mt-6">
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
                                </>
                            )}

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'}>
                                        Next
                                    </Button>
                                </Item>
                                <Item>
                                    <Link href={routes.cart.index}>
                                        <Button danger className={'w-32'}>
                                            Prev
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

export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;

    let cart = {}
    let addresses = [];
    if (userType !== 'customer') {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                authenticated,
                cart,
                addresses,
            }
        };
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const store = getStore();

    try {
        const response = await store.dispatch.cart.getCart(config);
        const addressesRes = await store.dispatch.profile.getAddresses(config)

        if(response) {
            cart = response;

            if(cart.products.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                        addresses,
                    }
                };
            } else {

                if(addressesRes) {
                    addresses = addressesRes;
                }
                return {
                    props: {
                        cart,
                        addresses,
                    }
                };
            }
        }
    } catch(e) {
        console.log(e);
        return {
            props: {
                cart,
                addresses,
            }
        }
    }
}

export default Delivery;