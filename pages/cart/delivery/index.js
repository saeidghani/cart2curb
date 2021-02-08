import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import {defaultMapLocation} from "../../../constants";

const { Item } = Form;
const { Option } = Select;

const Delivery = props => {
    const [form] = Form.useForm();
    const [newAddress, setNewAddress] = useState(false);
    const [province, setProvince] = useState('');
    const [marker, setMarker] = useState({ position: {}})
    const checkAddressLoading = useSelector(state => state.loading.effects.cart.checkAddress);
    const updateLoading = useSelector(state => state.loading.effects.cart.updateDelivery)
    const provinces = useProvinces();
    const cities = useCities(province);
    const dispatch = useDispatch();
    const router = useRouter();

    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Delivery'
        }
    ]

    const { addresses, cart } = props;

    useEffect(() => {
        form.setFieldsValue({
            date: cart.deliveryTime ? moment(cart.deliveryTime || '') : undefined,
            time: cart.deliveryTime ? moment(cart.deliveryTime || '') : undefined,
            address: cart.address?._id || undefined
        })
    }, [])

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
        const fromTime = moment(props.deliveryTimes.from);
        const toTime = moment(props.deliveryTimes.to);
        if(deliveryTime.diff(fromTime) < 0 || deliveryTime.diff(toTime) > 0) {
            message.error(`Delivery time should be between ${fromTime.format('MM.DD.YYYY - HH:mm')} and ${toTime.format('MM.DD.YYYY - HH:mm')}`)
            return false;
        }


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
            const { country, province, city, addressLine1, addressLine2, postalCode, location, _id} = addresses.find(item => item._id === address)
            transformedAddress = {
                country, province, city, addressLine1, addressLine2, postalCode, location, _id
            };
        }


        const res = await dispatch.cart.checkAddress({
            ...transformedAddress
        })
        if(!res) {
            return false;
        }
        const body = {
            time: deliveryTime,
            address: transformedAddress
        }
        const finalRes = await dispatch.cart.updateDelivery(body);
        if(finalRes) {
            message.success('Cart Address and Delivery time updated!')
            router.push(routes.cart.invoice.index);
        }
    }

    const checkValidation = errorInfo => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


    const disabledDate = (current) => {

        const fromTime = moment(props.deliveryTimes.from);
        const toTime = moment(props.deliveryTimes.to);
        return current && (current.diff(fromTime) < 0 || current.diff(toTime) > 0);
    }


    const onChangePostal = (e) => {
        form.setFieldsValue({
            postalCode: e.target.value.toUpperCase(),
        })
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
                                    <DatePicker className={'w-full'} disabledDate={disabledDate}/>
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
                                    <TimePicker className={'w-full'} format={'HH:mm'}/>
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

                                            const transformed = [address.addressLine1];
                                            if(address.addressLine2) {
                                                transformed.push(address.addressLine2);
                                            }
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
                                        <div className="mb-8 lg:mb-12 mt-6">
                                            <GoogleMap
                                                height={670}
                                                initialCenter={defaultMapLocation}
                                                marker={marker}
                                                clickHandler={changeMarkerPosition}
                                            />
                                        </div>
                                    </Col>
                                </>
                            )}

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={checkAddressLoading || updateLoading}>
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
    let deliveryTimes = {}
    if(!userType || !token) {
        res.writeHead(307, { Location: routes.cart.guest.index });
        res.end();
        return {
            props: {
                deliveryTimes,
                cart,
                addresses,
            }
        };
    }
    if (userType !== 'customer') {
        if(userType === 'vendor') {
            res.writeHead(307, { Location: routes.cart.guest.index })
        } else {
            res.writeHead(307, { Location: routes.auth.login });
        }
        res.end();
        return {
            props: {
                deliveryTimes,
                cart,
                addresses,
            }
        };
    }
    const config = {
        headers: {
            ...req.headers,
            Authorization: `Bearer ${token}`,
        }
    }

    const store = getStore();

    try {
        const response = await store.dispatch.cart.getCart(config);
        const addressesRes = await store.dispatch.profile.getAddresses(config)
        const deliveryTimesRes = await store.dispatch.cart.getDeliveryTime(config);

        if(response) {
            cart = response;
            if(!cart.products || cart.products?.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                        addresses,
                        deliveryTimes
                    }
                };
            } else {

                if(addressesRes) {
                    addresses = addressesRes;
                }
                if(deliveryTimesRes){
                    deliveryTimes = deliveryTimesRes;
                }else {
                    res.writeHead(307, { Location: routes.cart.index });
                    res.end();
                    return {
                        props: {
                            cart,
                            deliveryTimes
                        }
                    };
                }
                return {
                    props: {
                        cart,
                        addresses,
                        deliveryTimes
                    }
                };
            }
        }
    } catch(e) {
        console.log(e);

        res.writeHead(307, { Location: routes.cart.index });
        res.end();
        return {
            props: {
                cart,
                addresses,
                deliveryTimes
            }
        }
    }
}

export default Delivery;