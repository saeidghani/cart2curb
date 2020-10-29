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


const AccountEdit = props => {
    const loading = useSelector(state => state.loading.effects.profile.updateProfile);
    const [imageUrl, setImageUrl] = useState('')
    const [stream, setStream] = useState("Facebook")
    const token = useSelector(state => state.auth.token);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { profile } = props;

    useEffect(() => {
        let streamPreference = '',
            streamId = '',
            instagram = '',
            facebook = '';
        const streamOnIndex = profile.socialMedias ? profile.socialMedias.findIndex(item => item.streamOn) : -1;
        const instagramIndex = profile.socialMedias ? profile.socialMedias.findIndex(item => item.provider === 'instagram') : -1;
        const facebookIndex = profile.socialMedias ? profile.socialMedias.findIndex(item => item.provider === 'facebook') : -1;
        if(streamOnIndex > -1) {
            streamPreference = profile.socialMedias[streamOnIndex].provider;
            streamId = profile.socialMedias[streamOnIndex].username;
        }
        if(instagramIndex > -1) {
            instagram = profile.socialMedias[instagramIndex].username;
        }
        if(facebookIndex > -1) {
            facebook = profile.socialMedias[facebookIndex].username;
        }
        form.setFieldsValue({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            birthdate: moment(profile.birthdate || ''),
            notifyMethod: profile.notifyMethod || '',
            streamPreference,
            streamId,
            instagram,
            facebook,
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
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl);
            });
        }
    };


    const submitHandler = (values) => {
        const { notifyMethod, birthdate, streamPreference, streamId, facebook, instagram, firstName, lastName, phone, image } = values;
        const body = {
            notifyMethod,
            birthdate: moment(birthdate).format('YYYY-MM-DD'),
            image,
            firstName,
            lastName,
            phone
        }
        const socialMedias = [
            {
                "username": streamPreference === 'instagram' ? streamId : instagram,
                "provider": "instagram",
                "streamOn": streamPreference === 'instagram'
            },
            {
                "username": streamPreference === 'facebook' ? streamId : facebook,
                "provider": "facebook",
                "streamOn": streamPreference === 'facebook'
            }
        ];
        if(!['facebook', 'instagram'].includes(streamPreference)) {
            socialMedias.push({
                "username": streamId,
                "provider": streamPreference,
                "streamOn": true
            })
        }
        body.socialMedias = socialMedias;

        dispatch.profile.updateProfile(body)
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const uploadProps = {
        action: 'http://165.227.34.172:3003/api/v1/files/photos/',
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
                                              min: 3,
                                              message: "First name should be more than 3 characters."
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
                                              min: 3,
                                              message: "Last name should be more than 3 characters."
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
                                <Divider />
                            </Col>

                            <Col xs={24}>
                                <h3 className="text-type font-medium text-base mb-8">Details</h3>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'avatar'}>
                                    <div className={'flex items-center justify-start mt-4'}>
                                        <Upload
                                            name="image"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            {...uploadProps}

                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 50, height: 50, borderRadius: 50 }} /> : (
                                                <>
                                                    <div className={'full-rounded text-primary flex items-center justify-center'} style={{ width: 50, height: 50, borderRadius: 50}}>+</div>
                                                </>
                                            )}
                                        </Upload>
                                        <label htmlFor={'avatar'} className="text-info ml-3">Upload</label>
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
                                        <Option value={'email'}>Send a mail to Email Address</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'birthdate'} label={'Birthdate'}
                                    rules={[{
                                        required: true,
                                        message: 'This Field is required'
                                    }]}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'streamPreference'}
                                    label={'Stream Preference'}
                                    onChange={setStream}
                                    rules={[{
                                        required: true,
                                        message: 'This Field is required'
                                    }]}>
                                    <Select
                                        placeholder={'Select'}
                                    >
                                        <Option value={'facebook'}>Facebook</Option>
                                        <Option value={'instagram'}>Instagram</Option>
                                        <Option value={'zoom'}>Zoom</Option>
                                        <Option value={'skype'}>Skype</Option>
                                        <Option value={'whatsapp'}>Whatsapp</Option>
                                        <Option value={'slack'}>Slack</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'streamId'} label={`${stream} ID`}
                                    rules={[{
                                        required: true,
                                        message: 'This Field is required'
                                    }]}>
                                    <Input placeholder={`${stream} ID`} />
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Divider />
                            </Col>
                            <Col xs={24}>
                                <h3 className={'font-medium text-base pb-6'}>Social Integration</h3>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'facebook'} label={'Facebook'}
                                    rules={[{
                                        required: true,
                                        message: 'This Field is required'
                                    }]}>
                                    <Input placeholder="Facebook Username" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'instagram'} label={'Instagram'}
                                    rules={[{
                                        required: true,
                                        message: 'This Field is required'
                                    }]}>
                                    <Input placeholder="Instagram Username" />
                                </Item>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
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