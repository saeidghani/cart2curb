import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select, DatePicker, message, TimePicker
} from 'antd';

import Page from '../../../components/Page';
import GoogleMap from "../../../components/Map";
import {useCities, useProvinces} from "../../../hooks/region";
import routes from "../../../constants/routes";
import Link from "next/link";
import moment from "moment";
import cookie from "cookie";
import {getStore} from "../../../states";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {defaultMapLocation, streamPreferences} from "../../../constants";
import {useGeocoding} from "../../../hooks/geocoding";

const { Item } = Form;
const { Option } = Select;

const CartGuest = props => {
    const [form] = Form.useForm();
    const [province, setProvince] = useState('');
    const [marker, setMarker] = useState({ position: {}})
    const provinces = useProvinces();
    const cities = useCities(province);
    const [stream, setStream] = useState("Google Meet")
    const dispatch = useDispatch();
    const router = useRouter()
    const { cart } = props;
    const [geoCode, getGeoCode] = useGeocoding()

    const breadcrumb = [
        {
            title: 'Cart',
            href: '/cart'
        },
        {
            title: 'Guest'
        }
    ]

    useEffect(() => {
        if(cart.guest) {
            const { firstName, lastName, phone, email } = cart.guest;
            form.setFieldsValue({
                firstName,
                lastName,
                phone,
                email,
                date: cart.deliveryTime ? moment(cart.deliveryTime || '') : undefined,
                time: cart.deliveryTime ? moment(cart.deliveryTime || '') : undefined,
            })
            if(cart.guest.hasOwnProperty('socialMedias')) {
                form.setFieldsValue({
                    streamPreference: cart.guest.socialMedias.provider,
                    streamId: cart.guest.socialMedias.username
                })
            }
        }
        if(cart.address) {
            const { province, city, addressLine1, addressLine2, postalCode, location } = cart.address;
            form.setFieldsValue({
                province, city, addressLine1, addressLine2, postalCode
            })
            setMarker({
                position: {
                    lat: location.coordinates[1],
                    lng: location.coordinates[0],
                }
            })
        }

    }, [cart])

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
        if(!marker.position.hasOwnProperty('lat')) {
            message.error('Please select your location in map');
            return false;
        }
        const {date, time} = values;
        const deliveryTime = date.hours(time.hours()).minutes(time.minutes()).seconds(time.seconds());
        const fromTime = moment(props.deliveryTimes.from);
        const toTime = moment(props.deliveryTimes.to);
        if(deliveryTime.diff(fromTime) < 0 || deliveryTime.diff(toTime) > 0) {
            message.error(`Delivery time should be between ${fromTime.format('MM.DD.YYYY - HH:mm')} and ${toTime.format('MM.DD.YYYY - HH:mm')}`)
            return false;
        }

        const { firstName, lastName, email, phone, streamPreference, streamId } = values;
        const guestBody = {
            firstName,
            lastName,
            email,
            phone,
        }
        if(streamPreference && streamId) {
            guestBody.socialMedias = {
                username: streamId,
                provider: streamPreference,
                streamOn: true,
            }
        }

        const guestInfoRes = await dispatch.cart.guestInfo(guestBody);

        if(!guestInfoRes) {
            return false;
        }

        const { province, city, addressLine1, addressLine2, postalCode} = values;

        let transformedAddress = {
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
            router.push(routes.cart.guest.invoice);
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
        const value = e.target.value.toUpperCase()
        getGeoCode(value)
        form.setFieldsValue({
            postalCode: value
        })
    }

    const changeStream = (value, row) => {
        setStream(row.children)
    }

    return (
        <Page title={'Guest Cart'} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinishFailed={checkValidation}
                        onFinish={submitHandler}
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
                                <Item name={'streamPreference'} label={'LiveCart Viewing Preference'}>
                                    <Select
                                        placeholder={'Select'}
                                        onChange={changeStream}
                                    >
                                        <Option value={'zoom'}>Zoom</Option>
                                        <Option value={'googleMeet'}>Google Meet</Option>
                                        <Option value={'skype'}>Skype</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'streamId'}
                                    label={<span className="capitalize">{`${stream} ID`}</span>}
                                    rules={[
                                        ({getFieldValue}) => ({
                                            validator(rule, value) {
                                                const preference = getFieldValue('streamPreference');
                                                if (!preference || (preference && value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(`Please enter your ${streamPreferences[preference]} ID`);
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder={`${stream} ID`} />
                                </Item>
                            </Col>

                            <div className="w-full px-3">
                                <Divider className={'mt-6 mb-8'}/>
                            </div>

                            <Col xs={24}>
                                <h1 className={'text-type text-base font-medium mt-0 mb-8'}>Delivery Time & Address</h1>
                            </Col>
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
                                    <DatePicker className={'w-full'} disabledDate={disabledDate} />
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

                            <div className="w-full px-3">
                                <Divider className={'mt-2 mb-6'}/>
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
    let userType = cookies.type;

    let cart = {}
    let deliveryTimes = {}
    if(userType) {
        if(userType === 'customer') {
            res.writeHead(307, { Location: routes.cart.delivery });
            res.end();
            return {
                props: {
                    deliveryTimes,
                    cart,
                }
            };
        } else if(userType !== 'vendor') {
            res.writeHead(307, { Location: routes.auth.login });
            res.end();
            return {
                props: {
                    deliveryTimes,
                    cart,
                }
            };
        }
    }
    const store = getStore();

    try {
        const response = await store.dispatch.cart.getCart({
            headers: {
                ...req.headers
            }
        });
        const deliveryTimesRes = await store.dispatch.cart.getDeliveryTime({
            headers: {
                ...req.headers
            }
        });

        if(response) {
            cart = response;
            if(!cart.products || cart.products?.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                        deliveryTimes
                    }
                };
            } else {
                if(deliveryTimesRes){
                    deliveryTimes = deliveryTimesRes;
                } else {
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
                        deliveryTimes
                    }
                };
            }
        }
    } catch(e) {
        console.log(e);
        return {
            props: {
                cart,
                deliveryTimes
            }
        }
    }
}

export default CartGuest;