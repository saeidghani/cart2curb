import React, { useState } from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select,
    DatePicker,
    Upload,
    message
} from 'antd';
import moment from 'moment';
import axios from 'axios';

import Page from '../../../components/Page';
import routes from "../../../constants/routes";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import withAuth from "../../../components/hoc/withAuth";

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


const AccountInfo = props => {
    const [imageUrl, setImageUrl] = useState('')
    const [stream, setStream] = useState("Facebook")
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.profile.updateProfile);
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch()

    const breadcrumb = [
        {
            title: 'Register',
            href: '/signup'
        },
        {
            title: "Account Info"
        }
    ]

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

    const handleChange = info => {
        form.setFieldsValue({
            avatar: info.file,
        })

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
            const { notifyMethod, image, birthdate, streamPreference, streamId, facebook, instagram } = values;
            const body = {
                notifyMethod,
                birthdate: moment(birthdate).format('YYYY-MM-DD'),
                image,
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


    return (
        <Page title={'Account Info'} breadcrumb={breadcrumb}>
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
                                <Item name={'notifyMethod'} label={'Order Status Notification Method'}
                                    rules={[{
                                        required: true,
                                        message: "This Field is required"
                                    }]}>
                                    <Select
                                        placeholder={'Select'}
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
                                        message: "This Field is required"
                                    }]}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Item name={'streamPreference'} label={'Stream Preference'}>
                                    <Select
                                        placeholder={'Select'}
                                        onChange={setStream}
                                            rules={[{
                                                required: true,
                                                message: "This Field is required"
                                            }]}
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
                                        message: "This Field is required"
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
                                        message: "This Field is required"
                                    }]}>
                                    <Input placeholder="Facebook Username" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'instagram'} label={'Instagram'}
                                    rules={[{
                                        required: true,
                                        message: "This Field is required"
                                    }]}>
                                    <Input placeholder="Instagram Username" />
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} className={'flex items-center justify-end'}>
                                <Item>
                                    <Link href={routes.profile.index}>
                                        <Button danger className={'w-32'}>Cancel</Button>
                                    </Link>
                                </Item>
                                <Item>
                                    <Button type="primary" htmlType={'submit'} block className={'w-32 ml-5'} loading={loading}>
                                        Save
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

export default withAuth(AccountInfo);