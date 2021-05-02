import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Upload,
    Checkbox,
    message, DatePicker
} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import Link from "next/link";

import DriverPage from '../../../components/Driver/DriverPage';
import {CloudUploadOutlined, UserOutlined} from '@ant-design/icons';
import ImgCrop from "antd-img-crop";
import routes from "../../../constants/routes";
import Success from "../../../components/Driver/Success";

const {Item} = Form;

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

const Register = props => {
    const loading = useSelector(state => state?.loading?.effects?.driverAuth?.register);
    const [insurancePic, setInsurancePic] = useState('');
    const [licencePic, setLicencePic] = useState('');
    const [imagePic, setImagePic] = useState('');
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const token = useSelector(state => state?.adminAuth?.token);
    const [submitted, setSubmitted] = useState(false);
    const [isAcceptedAgreement, setIsAcceptedAgreement] = useState(false);

    const handleInsuranceUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setInsurancePic(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const handleLicenceUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setLicencePic(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const handleImageUpload = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImagePic(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

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
    };

    const scrollToTop = () => {
        const yScroll = window.scrollY;
        window.scrollTo(0, yScroll * 0.9);

        if (window.scrollY > 5) {
            requestAnimationFrame(scrollToTop);
        }
    };

    const submitHandler = async (values) => {
        const {
            name,
            email,
            phone,
            birthdate,
            acceptAgreement,
            password
        } = values;
        const body = {
            name,
            email,
            phone,
            birthdate: birthdate ? moment(birthdate) : '',
            acceptAgreement: !!acceptAgreement,
            password
        };
        if (insurancePic) body.proofOfInsurance = [insurancePic];
        if (licencePic) body.license = licencePic;
        if (imagePic) body.image = imagePic;

        const agreement = Boolean(form.getFieldValue('acceptAgreement'));

        if (insurancePic && licencePic && imagePic) {
            const res = await dispatch?.driverAuth?.register(body);
            if (res) {
                setSubmitted(true)
                scrollToTop();
            }
        }
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    };

    const UploadPhoto = ({imageUrl, text, onUpload, icon}) => (
        <ImgCrop>
            <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader-wrapper border-0"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={onUpload}
                {...uploadProps}
            >
                <div className="avatar-uploader">
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: 50, height: 50, borderRadius: 50}}/> : (
                        <>
                            <div className={'full-rounded text-overline bg-card flex items-center justify-center'}
                                 style={{width: 50, height: 50, borderRadius: 50}}>
                                {icon}
                            </div>
                        </>
                    )}
                </div>
                <label htmlFor={'avatar'} className="text-secondarey ml-3 cursor-pointer">{text}</label>
            </Upload>
        </ImgCrop>
    );

    return (
        <DriverPage title={submitted ? false : 'Register'}>
            {submitted ? <Success/> :
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
                                <Col xs={24}>
                                    <Item name={'name'} label={'Name'} rules={[
                                        {
                                            required: true,
                                            message: "Please enter your name"
                                        }
                                    ]}>
                                        <Input placeholder="Name"/>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item name={'email'} label={'Email'} rules={[
                                        {
                                            required: true,
                                            message: "Please enter your Email Address"
                                        },
                                        {
                                            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                            message: "Please enter valid Email Address"
                                        }
                                    ]}>
                                        <Input placeholder="Email"/>
                                    </Item>
                                </Col>

                                <Col xs={24}>
                                    <Item name={'phone'} label={'Phone Number'} rules={[
                                        {
                                            required: true,
                                            message: "Please enter your phone number"
                                        },
                                        {
                                            pattern: /^[1-9][0-9]*$/,
                                            message: "Please enter valid Phone number"
                                        },
                                        {
                                            min: 3,
                                            message: "Phone Number should be more than 3 digits"
                                        },
                                        {
                                            max: 14,
                                            message: "Phone Number should be less than 14 digits"
                                        }
                                    ]}>
                                        <Input placeholder="+00 00000000"/>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item name={'birthdate'} label={'Birthdate'}
                                          rules={[{
                                              required: true,
                                              message: 'This Field is required'
                                          },
                                              ({getFieldValue}) => ({
                                                  validator(rule, value) {
                                                      const isOldEnough = moment(moment()).diff(value, 'years') >= 19;
                                                      if (value && !isOldEnough) {
                                                          return Promise.reject('You are not old enough');
                                                      }
                                                      return Promise.resolve();
                                                  },
                                              }),
                                          ]}>
                                        <DatePicker className={'w-full'}/>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item name={'password'} label={'Password'} rules={[
                                        {
                                            required: true,
                                            message: "Please enter your password"
                                        },
                                        {
                                            min: 6,
                                            message: "Password should be at least 6 characters"
                                        }
                                    ]}>
                                        <Input.Password placeholder="Password"/>
                                    </Item>
                                </Col>
                                <Col xs={24} className="">
                                    <Item name={'password-confirm'}
                                          label={'Confirm Password'}
                                          dependencies={['password']}
                                          hasFeedback
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Please confirm your password!',
                                              },
                                              ({getFieldValue}) => ({
                                                  validator(rule, value) {
                                                      if (!value || getFieldValue('password') === value) {
                                                          return Promise.resolve();
                                                      }
                                                      return Promise.reject('The two passwords that you entered do not match!');
                                                  },
                                              }),
                                          ]}>
                                        <Input.Password placeholder="Confirm Password"/>
                                    </Item>
                                </Col>
                                <Col className="mb-4" xs={24}>Can you provide:</Col>
                                <Col xs={24} className="">
                                    <Item name="proofOfInsurance">
                                        <div className={'flex items-center justify-start'}>
                                            <UploadPhoto imageUrl={insurancePic} text="Proof of Insurance"
                                                         onUpload={handleInsuranceUpload}
                                                         icon={<CloudUploadOutlined className={'text-lg'}/>}/>
                                        </div>
                                    </Item>
                                </Col>
                                <Col xs={24} className="">
                                    <Item name="license">
                                        <div className={'flex items-center justify-start'}>
                                            <UploadPhoto imageUrl={licencePic} text="Valid Driver's License"
                                                         onUpload={handleLicenceUpload}
                                                         icon={<CloudUploadOutlined className={'text-lg'}/>}/>
                                        </div>
                                    </Item>
                                </Col>
                                <Col xs={24} className="">
                                    <Item name="image">
                                        <div className={'flex items-center justify-start'}>
                                            <UploadPhoto imageUrl={imagePic} text="Current Picture of yourself"
                                                         onUpload={handleImageUpload}
                                                         icon={<UserOutlined className={'text-lg'}/>}/>
                                        </div>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item
                                        name="acceptAgreement"
                                        valuePropName="checked"
                                    >
                                        <Checkbox
                                            className="text-xs mb-10"
                                            onChange={(val) => {
                                                if (val?.target?.checked) {
                                                    setIsAcceptedAgreement(true);
                                                } else {
                                                    setIsAcceptedAgreement(false);
                                                }
                                            }}
                                        >
                                            I am willing to obtain a police record
                                        </Checkbox>
                                    </Item>
                                </Col>
                                <Col xs={24} className="">
                                    <Item shouldUpdate>
                                        {() => <Button
                                            type="primary"
                                            block
                                            htmlType={'submit'}
                                            loading={loading}
                                            disabled={form.getFieldsError().filter(({errors}) => errors.length).length > 0}
                                        >
                                            Submit
                                        </Button>}
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <div className="text-sm font-medium flex justify-center">
                                        <div>Already a Cart2Curb driver?</div>
                                        <Link href={routes.driver.auth.login}>
                                            <div className="ml-2 text-blue-600 text-sm font-medium">Login</div>
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>}
        </DriverPage>
    )
}

export default Register;