import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Input, Button, message, Upload} from 'antd';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import {CloudUploadOutlined, UserOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import routes from '../../../constants/routes';

const {Item} = Form;

const Edit = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile?.getProfile);
    const token = useSelector(state => state?.adminAuth?.token);
    const profile = useSelector(state => state?.adminProfile?.profile);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');


    useEffect(() => {
        if (token) {
            dispatch?.adminProfile?.getProfile({token});
        }
    }, [token]);

    useEffect(() => {
        const {email, image} = profile || {};
        setImageUrl(image);
        form.setFieldsValue({
            email
        });
    }, [profile]);

    const uploadProps = {
        action: '/v1/files/photos/',
        headers: {
            Authorization: `Bearer ${token}`
        },

        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068'
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`
        }
    };

    const handleUpload = info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info?.file?.response?.data?.path || ''}`);
        }
    };

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
    };

    const submitHandler = async (values) => {
        const {email, currentPassword, newPassword} = values;
        const body = {email, currentPassword, newPassword};
        if (imageUrl) {
            body.image = imageUrl;
        }
        const res = await dispatch.adminProfile.editProfile({body, token});
        if (res) {
            router.push({pathname: routes.admin.users.index});
        }
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    };
    return (
        <div className="">
            <div className="flex justify-end">
                <Button
                    danger
                    className="px-3"
                    onClick={() => dispatch?.adminAuth?.logout()}
                >
                    LOG OUT
                </Button>
            </div>
            <Form className="mt-4" form={form} layout={'vertical'} onFinish={submitHandler}
                  onFinishFailed={checkValidation}>
                <Row gutter={24}>
                    <Col xs={24} md={12} lg={8}>
                        <Item name='email' label='Email Address'>
                            <Input placeholder='Email Address'/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={16}>
                        <Item name={'image'} className="">
                            <div className="flex items-center space-x-4 pt-4">
                                <div className="">Upload Image</div>
                                <ImgCrop>
                                    <Upload
                                        name={'image'}
                                        listType="picture"
                                        className={'upload-list-inline'}
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleUpload}
                                        {...uploadProps}
                                    >
                                        <div className="flex space-x-2">
                                            {imageUrl ?
                                                <img src={imageUrl} alt="avatar" style={{width: 70, height: 70}}/> : (
                                                    (
                                                        <>
                                                            <div
                                                                className={'full-rounded text-overline bg-card flex items-center justify-center'}
                                                                style={{width: 50, height: 50, borderRadius: 50}}>
                                                                <UserOutlined className={'text-lg'}/>
                                                            </div>
                                                        </>
                                                    )
                                                )}
                                            <div className="pt-1 h-full" style={{float: 'left'}}>
                                                <div
                                                    className={'flex items-center justify-center border border-solid border-input px-4 py-2'}
                                                >
                                                    <CloudUploadOutlined className={'text-2xl text-icon'}/>
                                                    <div className={'pl-3 text-cell'}>Upload</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Upload>
                                </ImgCrop>
                            </div>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name='currentPassword' label='Current Password'>
                            <Input placeholder='Current Password'/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name='newPassword' label='New Password'>
                            <Input placeholder='New Password'/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name='confirmNewPassword' label='Confirm New Password'>
                            <Input placeholder='Confirm New Password'/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse md:mt-10 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-full md:w-32 ml-0 md:ml-5'} htmlType={'submit'}
                                    loading={loading}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Button danger className={'w-full md:w-32'}>Cancel</Button>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default Edit;
