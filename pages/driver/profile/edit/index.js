import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Upload,
    Checkbox,
    message, DatePicker, Modal
} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import Link from "next/link";
import {useRouter} from "next/router";

import DriverPage from '../../../../components/Driver/DriverPage';
import Loader from '../../../../components/UI/Loader';
import DriverAuth from '../../../../components/Driver/DriverAuth';
import {CloudUploadOutlined, QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import ImgCrop from "antd-img-crop";
import routes from "../../../../constants/routes";

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

const Edit = props => {
    const loading = useSelector(state => state?.loading?.effects?.driverProfile?.getProfile);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const token = useSelector(state => state?.driverAuth?.token);
    const profile = useSelector(state => state?.driverProfile?.profile);
    const router = useRouter();
    const [insurancePic, setInsurancePic] = useState('');
    const [licencePic, setLicencePic] = useState('');
    const [imagePic, setImagePic] = useState('');
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch?.driverProfile?.getProfile({token});
        }
    }, [token]);

    useEffect(() => {
        const {proofOfInsurance, name, email, phone, birthdate, license, image} = profile || {};
        form.setFieldsValue({
            name,
            email,
            phone,
            birthdate: birthdate ? moment(birthdate) : '',
            acceptAgreement: true
        });
        setLicencePic(license);
        setImagePic(image);
        setInsurancePic(proofOfInsurance?.length > 0 ? proofOfInsurance[0] : '');
    }, [profile]);

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
            email,
            phone,
            birthdate,
            acceptAgreement,
        } = values;
        const body = {
            email,
            phone,
            birthdate: birthdate ? moment(birthdate) : '',
            acceptAgreement: !!acceptAgreement,
        };
        if (insurancePic) body.proofOfInsurance = [insurancePic];
        if (licencePic) body.license = licencePic;
        if (imagePic) body.image = imagePic;

        const res = await dispatch?.driverProfile?.editProfile({body, token});
        if (res) {
            router.push(routes.driver.profile.index);
        }
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    };

    const handleLogout = () => {
        dispatch?.driverAuth?.logout();
        setLogoutModalVisible(false);
        router.push(routes.driver.auth.login);
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
        <DriverAuth>
            <DriverPage title=''>
                <Modal
                    visible={logoutModalVisible}
                    okText="Yes, Log Out"
                    cancelText="Cancel"
                    onOk={handleLogout}
                    onCancel={() => setLogoutModalVisible(false)}
                    width={328}
                >
                    <div className="flex space-x-3">
                        <QuestionCircleOutlined style={{color: "#FAAD14", fontSize: 18, marginTop: 2}}/>
                        <div>
                            <div className="font-bold">Log Out</div>
                            <div className="mt-2">Are you sure to log out from your account?</div>
                        </div>
                    </div>
                </Modal>
                <div className="text-2xl mb-6">Edit Profile</div>
                {loading ? <div className="flex justify-center" style={{minHeight: 500}}><Loader/></div> :
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
                                            <Input placeholder="Name" disabled/>
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
                                    <Col xs={24} className="">
                                        <Item name="proofOfInsurance">
                                            <div className={'flex items-center justify-start mt-2'}>
                                                <UploadPhoto imageUrl={insurancePic} text="Upload Proof of Insurance"
                                                             onUpload={handleInsuranceUpload}
                                                             icon={<CloudUploadOutlined className={'text-lg'}/>}/>
                                            </div>
                                        </Item>
                                    </Col>
                                    <Col xs={24} className="">
                                        <Item name="license">
                                            <div className={'flex items-center justify-start'}>
                                                <UploadPhoto imageUrl={licencePic} text="Upload Driver License Picture"
                                                             onUpload={handleLicenceUpload}
                                                             icon={<CloudUploadOutlined className={'text-lg'}/>}/>
                                            </div>
                                        </Item>
                                    </Col>
                                    <Col xs={24} className="">
                                        <Item name="image">
                                            <div className={'flex items-center justify-start'}>
                                                <UploadPhoto imageUrl={imagePic} text="Upload Image"
                                                             onUpload={handleImageUpload}
                                                             icon={<UserOutlined className={'text-lg'}/>}/>
                                            </div>
                                        </Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Item name="acceptAgreement" valuePropName="checked">
                                            <Checkbox className="text-xs" disabled defaultChecked>
                                                I am willing to obtain police record
                                            </Checkbox>
                                        </Item>
                                    </Col>
                                    <Col
                                        xs={24}
                                        className="mb-10 text-sm font-medium text-red-500"
                                        onClick={() => setLogoutModalVisible(true)}
                                    >
                                        Log Out
                                    </Col>
                                    <Col xs={24}>
                                        <Item>
                                            <Button type="primary" block htmlType={'submit'} loading={loading}>
                                                Save Changes
                                            </Button>
                                        </Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Item>
                                            <Link href={routes.driver.profile.index}>
                                                <Button
                                                    block
                                                    className="w-full p-3 border border-red-500 border-solid text-red-500 text-center font-medium text-sm mr-1"
                                                >
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>}
            </DriverPage>
        </DriverAuth>
    )
}

export default Edit;