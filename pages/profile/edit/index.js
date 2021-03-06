import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select, Upload, DatePicker, message
} from 'antd';

import Page from '../../../components/Page';
import routes from "../../../constants/routes";
import cookie from "cookie";
import {getStore} from "../../../states";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import Link from "next/link";
import {useRouter} from "next/router";
import {UserOutlined} from "@ant-design/icons";
import userTypes from "../../../constants/userTypes";
import ImgCrop from "antd-img-crop";
import {streamPreferences} from "../../../constants";

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


const AccountEdit = props => {
    const loading = useSelector(state => state.loading.effects.profile.updateProfile);
    const [imageUrl, setImageUrl] = useState(props.profile.image || '')
    const [stream, setStream] = useState("Google Meet")
    const token = useSelector(state => state.auth.token);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const { profile } = props;

    useEffect(() => {
        let streamPreference = undefined,
            streamId = '';
        const streamOnIndex = profile.socialMedias ? profile.socialMedias.findIndex(item => item.streamOn) : -1;
        if(streamOnIndex > -1) {
            streamPreference = profile.socialMedias[streamOnIndex].provider;
            streamId = profile.socialMedias[streamOnIndex].username;
            setStream(streamPreference);
        }
        form.setFieldsValue({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            birthdate: profile.birthdate ? moment(profile.birthdate) : '',
            notifyMethod: profile.notifyMethod || undefined,
            streamPreference,
            streamId,
        })
    }, [])
    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: 'Add/Edit Info'
        }
    ]

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };


    const submitHandler = async (values) => {
        const { notifyMethod, birthdate, streamPreference, streamId, firstName, lastName, phone } = values;
        let wasStreamSet = false;
        const body = {
            notifyMethod,
            birthdate: birthdate ? moment(birthdate).format('YYYY-MM-DD') : undefined,
            firstName,
            lastName,
            phone
        }
        if(imageUrl) {
            body.image = imageUrl
        }
        const socialMedias = [];
        if(streamPreference && !wasStreamSet) {
           /* if(!streamId) {
                message.error('Please enter your Username');
                return false;
            }*/

            if(!wasStreamSet) {
                socialMedias.push({
                    //"username": streamId,
                    "provider": streamPreference,
                    "streamOn": true
                })
            }
        }
        body.socialMedias = socialMedias;

        const res = await dispatch.profile.updateProfile(body)
        if(res) {
            router.push(routes.profile.index);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    }

    const changeStream = (value, row) => {
        setStream(row.children)
    }

    return (
        <Page title={'Account Edit'} breadcrumb={breadcrumb}>
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
                                <Item name={'firstName'} label={'First Name'}
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
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'lastName'} label={'Last Name'}
                                      rules={[
                                          {
                                              required: true,
                                              message: "Please enter you last name"
                                          },
                                          {
                                              min: 1,
                                              message: "Last name should be more than 1 characters."
                                          }
                                      ]}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
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
                                      ]}
                                >
                                    <Input type='email' placeholder="Email Address" disabled={true} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
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
                                    <Input placeholder="Phone Number" />
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider className={'my-2'}/>
                            </Col>

                            <Col xs={24}>
                                <h3 className="text-type font-medium text-base mb-6 mt-6">Details</h3>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'avatar'}>
                                    <div className={'flex items-center justify-start mt-4'}>

                                        <ImgCrop>
                                            <Upload
                                                name="photo"
                                                listType="picture-card"
                                                className="avatar-uploader-wrapper border-0"
                                                showUploadList={false}
                                                beforeUpload={beforeUpload}
                                                onChange={handleChange}
                                                {...uploadProps}
                                            >
                                                <div className="avatar-uploader">
                                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 50, height: 50, borderRadius: 50 }} /> : (
                                                        <>
                                                            <div className={'full-rounded text-overline bg-card flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>
                                                                <UserOutlined className={'text-lg'}/>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <label htmlFor={'avatar'} className="text-info ml-3 cursor-pointer">Upload Image</label>

                                            </Upload>
                                        </ImgCrop>
                                    </div>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'notifyMethod'} label={'Order Status Notification Method'}>
                                    <Select
                                        placeholder={'Select'}
                                            rules={[{
                                                required: true,
                                                message: 'This Field is required'
                                            }]}
                                    >
                                        <Option value={'sms'}>Text Message to Phone Number</Option>
                                        <Option value={'email'}>Send an Email</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'birthdate'} label={'Birthdate (Required for alcohol/tobacco deliveries)'}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'streamPreference'}
                                    label='LiveCart Preference(optional)'>
                                    <Select
                                        placeholder={'Select'}
                                        onChange={changeStream}
                                    >
                                        <Option value=''>-</Option>
                                        <Option value={'zoom'}>Zoom</Option>
                                        <Option value={'googleMeet'}>Google Meet</Option>
                                        <Option value={'skype'}>Skype</Option>
                                    </Select>
                                </Item>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-2'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={loading}>
                                        Save
                                    </Button>
                                </Item>
                                <Item>
                                    <Link href={routes.profile.index}>
                                        <Button danger className={'w-32'}>
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


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let profile = {};
    if (!token) {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    if(cookies.type !== 'customer') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                profile
            }
        };
    }


    const store = getStore();
    const response = await store.dispatch.profile.getProfile({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(response) {
        profile = response;
    }
    return {
        props: {
            profile
        }
    }
}

export default AccountEdit;
