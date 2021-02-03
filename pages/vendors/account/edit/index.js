import React, {useEffect, useState} from 'react';
import {Row, Col, Steps, Form, Input, Select, TimePicker, Upload, Checkbox, Divider, Grid, Button, message} from "antd";
import moment from 'moment';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import Link from "next/link";
import GoogleMap from "../../../../components/Map";
import PolygonMap from "../../../../components/Map/PolygonMap";
import {useDispatch, useSelector} from "react-redux";
import {useCities, useProvinces} from "../../../../hooks/region";
import {useRouter} from "next/router";
import cookie from "cookie";
import {getStore} from "../../../../states";
import {getProperty, isPointInside} from "../../../../helpers";
import {PictureOutlined, UserOutlined} from "@ant-design/icons";
import userTypes from "../../../../constants/userTypes";
import ImgCrop from "antd-img-crop";


const { Step } = Steps;
const { Item } = Form;
const { Option } = Select;


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
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(props.fields[0].imageStore)
    const [avatarUrl, setAvatarUrl] = useState(props.fields[0].image)
    const [marker, setMarker] = useState(props.marker)
    const [area, setArea] = useState(props.area);
    const [province, setProvince] = useState(props.fields[1].province);
    const token = useSelector(state => state.vendorAuth.token);
    const [step, setStep] = useState(0)
    const screens = Grid.useBreakpoint();
    const provinces = useProvinces();
    const cities = useCities(province);
    const dispatch = useDispatch();
    const router = useRouter();
    const [lastReached, setLastReached] = useState(0);

    useEffect(() => {

        form.setFieldsValue({
            email: props.fields[0].email,
            phone: props.fields[0].phone,
            contactName: props.fields[0].contactName,
            openingHour: moment(props.fields[0].openingHour),
            closingHour: moment(props.fields[0].closingHour),
            storeType: props.fields[0].storeType,
            subType: props.fields[0].subType,
            name: props.fields[0].name,
            province: props.fields[1].province,
            city: props.fields[1].city,
            addressLine1: props.fields[1].addressLine1,
            addressLine2: props.fields[1].addressLine2,
            postalCode: props.fields[1].postalCode,
            description: props.fields[1].description,
            needDriversToGather: props.fields[1].needDriversToGather ? 'true' : 'false'
        })
    }, [])

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

            handler(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const addStepHandler = (values, step) => {
        if(step === 1 && !marker.position.hasOwnProperty('lat')) {
            message.error('Please Select Your Location on Map')
        } else {
            setLastReached(step + 1);
            setStep(step + 1);
            scrollToTop();
        }
    }

    const prevHandler = (step) => {
        setStep(step - 1);
        scrollToTop();
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
        const formFields = form.getFieldsValue(true)
        console.log(formFields);
        const address = {
            country: 'Canada',
            province: formFields.province,
            city: formFields.city,
            addressLine1: formFields.addressLine1,
            addressLine2: formFields.addressLine2,
            postalCode: formFields.postalCode,
            location: {
                type: 'Point',
                coordinates: [marker.position.lng, marker.position.lat]
            }
        }
        const store = {
            address,
            description: formFields.description,
            openingHour: formFields.openingHour.toISOString(),
            closingHour: formFields.closingHour.toISOString(),
            name: formFields.name,
            area: {
                type: 'Polygon',
                coordinates: [area.map(point => [point.lng, point.lat]).concat([[area[0].lng, area[0].lat]])],
            },
            image: imageUrl,
            needDriversToGather: formFields.needDriversToGather && formFields.needDriversToGather.includes('true') ? true : false,
            storeType: formFields.storeType,
            subType: formFields.subType,
        }

        const vendor = {
            phone: formFields.phone,
            contactName: formFields.contactName,
            image: avatarUrl,
        }

        const body = {
            vendor,
            store,
        }

        const result = await dispatch.vendorProfile.updateProfile(body);

        if(result) {
            router.push(routes.vendors.account.index);
        }

    }

    const jumpHandler = (newStep) => {
        setStep(newStep);
        scrollToTop();
    }

    const scrollToTop = () => {
        const yScroll = window.scrollY;
        window.scrollTo(0, yScroll * 0.9);

        if(window.scrollY > 5) {
            requestAnimationFrame(scrollToTop);
        }
    }


    return (
        <Page title={'Edit Profile'} breadcrumb={breadcrumb}>
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
                                        <Input placeholder={'Email Address'} disabled/>
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
                                        <TimePicker className={'w-full'} format={'HH:mm'}/>
                                    </Item>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name={'closingHour'} label={'Store Close Time'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: "Store Close Time field is required"
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
                                        <TimePicker className={'w-full'} format={'HH:mm'}/>
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
                                                <Select placeholder={'Type/Service'} disabled={true}>
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
                                    <Link href={routes.vendors.account.index}>
                                        <Button danger className={'w-32'}>Cancel</Button>
                                    </Link>
                                </Col>
                            </Row>
                        </Form>
                    ) : step === 1 ? (
                        <Form layout={'vertical'} form={form} onFinish={(values) => addStepHandler(values, 1)} onFinishFailed={checkValidation}>
                            <Row gutter={24}>
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
                                        <Input placeholder={'Postal Code'}/>
                                    </Item>
                                </Col>

                                <Col span={24}>
                                    <Item name={'description'} label={'Store Description'}>
                                        <Input.TextArea placeholder={'Store Description'} autoSize={{ minRows: 4, maxRows: 9 }} style={{ resize: 'none' }}/>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <Item name={'needDriversToGather'} label={'Who will be picking out the goods from the store:'}>
                                        <Select
                                            placeholder={'Select'}
                                        >
                                            <Option value={'false'}>Store employee will gather the goods when an order comes in, and place by the door.</Option>
                                            <Option value={'true'}>Cart2Curb driver will be required to pick out the goods, and checkout.(discount will be given at the register)</Option>
                                        </Select>
                                    </Item>
                                </Col>
                                <Col span={24}>
                                    <div className="mb-6">
                                        <GoogleMap
                                            height={670}
                                            initialCenter={marker.position || {
                                                lat: 40.781305,
                                                lng: -73.9666857
                                            }}
                                            marker={marker}
                                            clickHandler={changeMarkerPosition}
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} className={'flex flex-row-reverse md:mt-0 mt-6'}>
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
                                    initialCenter={marker.position || {
                                        lat: 40.781305,
                                        lng: -73.9666857
                                    }}
                                    area={area}
                                    marker={marker}
                                    clickHandler={addPointToAreaHandler}
                                />
                            </Col>

                            <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                                <Button type="primary" block className={'w-32 ml-5'} onClick={submitHandler}>
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


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;


    let profile = {};
    let marker = {};
    let area = []
    const fields = [];
    if (!token) {
        res.writeHead(307, { Location: routes.vendors.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    if(cookies.type !== 'vendor') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    try {

        const store = getStore();
        const response = await store.dispatch.vendorProfile.getProfile({
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(response) {
            profile = response;
        }
        const markCoords = profile.store.address.location.coordinates
        marker = {
            position: {
                lat: markCoords[1],
                lng: markCoords[0]
            }
        }
        const areaCoords = profile.store.area.coordinates[0];
        for(let i in areaCoords){
            const index = area.findIndex(item => item.lat === areaCoords[i][1] && item.lng === areaCoords[i][0]);
            if(index === -1) {
                area.push({
                    lat: areaCoords[i][1],
                    lng: areaCoords[i][0]
                })
            }
        }
        fields[0] = {
            email: getProperty(profile, 'email', ''),
            phone: getProperty(profile, 'phone', ''),
            contactName: getProperty(profile, 'contactName', ''),
            openingHour: getProperty(profile.store, 'openingHour', ''),
            closingHour: getProperty(profile.store, 'closingHour', ''),
            storeType: getProperty(profile.store, 'storeType', ''),
            subType: getProperty(profile.store, 'subType', ''),
            name: getProperty(profile.store, 'name', ''),
            imageStore: getProperty(profile.store, 'image', ''),
            image: getProperty(profile, 'image', ''),
        }

        fields[1] = {
            province: getProperty(profile.store.address, 'province', ''),
            city: getProperty(profile.store.address, 'city', ''),
            addressLine1: getProperty(profile.store.address, 'addressLine1', ''),
            addressLine2: getProperty(profile.store.address, 'addressLine2', ''),
            postalCode: getProperty(profile.store.address, 'postalCode', ''),
            needDriversToGather: getProperty(profile.store, 'needDriversToGather', ''),
            description: getProperty(profile.store, 'description', ''),
        }
        return {
            props: {
                profile,
                marker,
                area,
                fields
            }
        }
    } catch(e) {
        return {
            props: {
                profile,
                marker,
                area,
                fields
            }
        }
    }
}

export default EditAccount;