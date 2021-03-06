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
    Upload,
    message
} from 'antd';
import moment from 'moment';

import Page from '../Page';
import routes from "../../constants/routes";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {UserOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {streamPreferences} from "../../constants";

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


const AccountInfo = props => {
    const [imageUrl, setImageUrl] = useState('')
    const [stream, setStream] = useState("Google Meet")
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.profile.updateProfile);
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch()
    const router = useRouter()

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

    const handleChange = info => {
        form.setFieldsValue({
            avatar: info.file,
        })

        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const submitHandler = async (values) => {
        const { notifyMethod, birthdate, streamPreference, streamId } = values;
        let wasStreamSet = false;
        const body = {
            notifyMethod,
            birthdate: birthdate ? moment(birthdate).format('YYYY-MM-DD') : undefined,
        }

        if(imageUrl) {
            body.image = imageUrl
        }

        const socialMedias = [];

        if(streamPreference && !wasStreamSet) {

            if(!wasStreamSet) {
                socialMedias.push({
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

    const changeStream = (value, row) => {
        setStream(row.children)
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
                                <Item name={'notifyMethod'} label={'Order Status Notification Method'}
                                    rules={[{
                                        required: true,
                                        message: "This Field is required"
                                    }]}>
                                    <Select
                                        placeholder={'Select'}
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
                                <Item name={'streamPreference'} label={'LiveCart Preference(optional)'}>
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
                            <Col xs={24} className={'flex md:flex-row flex-col-reverse items-stretch md:items-center justify-center md:justify-end'}>
                                <Item>
                                    <Link href={routes.profile.index}>
                                        <Button danger className={'w-full md:w-32'}>Cancel</Button>
                                    </Link>
                                </Item>
                                <Item>
                                    <Button type="primary" htmlType={'submit'} block className={'w-full md:w-32 ml-0 md:ml-5'} loading={loading}>
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

export default AccountInfo;
