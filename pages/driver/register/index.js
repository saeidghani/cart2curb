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
import {useRouter} from "next/router";

import DriverPage from '../../../components/DriverPage';
import {CloudUploadOutlined, UserOutlined} from '@ant-design/icons';

const {Item} = Form;

const Register = props => {
    const loading = useSelector(state => state?.loading?.effects?.driverAuth?.register);
    const [imageUrl, setImageUrl] = useState('')
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info.file.response.data.path}`);
        }
    };

    const submitHandler = async (values) => {
        const {
            name,
            email,
            phone,
            birthdate,
            proofOfInsurance,
            license,
            image,
            acceptAgreement,
            password
        } = values;
        const body = {
            name,
            email,
            phone,
            birthdate: birthdate ? moment(birthdate) : '',
            proofOfInsurance: [proofOfInsurance],
            license,
            image,
            acceptAgreement,
            password
        };
        console.log(body);

       /* const res = await dispatch?.driverAuth?.register(body);
        if (res) {
            //router.push(routes.driver.auth.login);
        }*/
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    };

    return (
        <DriverPage title={'Drive For Us'}>
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
                                <Item name={'name'} label={'Name'}>
                                    <Input placeholder="Name"/>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'email'} label={'Email'}>
                                    <Input placeholder="Email"/>
                                </Item>
                            </Col>

                            <Col xs={24}>
                                <Item name={'phone'} label={'Phone Number'}>
                                    <Input placeholder="+00 00000000"/>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'birthdate'} label={'Birthdate'}
                                      rules={[{
                                          required: true,
                                          message: 'This Field is required'
                                      }]}>
                                    <DatePicker className={'w-full'}/>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'password'} label={'Password'}>
                                    <Input placeholder="Password"/>
                                </Item>
                            </Col>
                            <Col xs={24}>
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
                            <Col xs={24} className="mb-10">
                                <Item name="proofOfInsurance">
                                    <Upload>
                                        <div className="flex border-none bg-transparent items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray">
                                                <CloudUploadOutlined className="text-icon"/>
                                            </div>
                                            <div className="ml-3 text-sm font-normal text-blue-500">
                                                Upload Proof of Insurance
                                            </div>
                                        </div>
                                    </Upload>
                                </Item>
                            </Col>
                            <Col xs={24} className="mb-10">
                                <Item name="license">
                                    <Upload>
                                        <Button className="flex border-none bg-transparent items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray">
                                                <CloudUploadOutlined className="text-icon"/>
                                            </div>
                                            <div className="ml-3 text-sm font-normal text-blue-500">
                                                Upload Driver License Picture
                                            </div>
                                        </Button>
                                    </Upload>
                                </Item>
                            </Col>
                            <Col xs={24} className="mb-10">
                                <Item name="image">
                                    <Upload>
                                        <Button className="flex border-none bg-transparent items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray">
                                                <UserOutlined className="text-icon"/>
                                            </div>
                                            <div className="ml-3 text-sm font-normal text-blue-500">
                                                Upload image
                                            </div>
                                        </Button>
                                    </Upload>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name="acceptAgreement" valuePropName="checked">
                                    <Checkbox className="text-xs mb-10">
                                        I am willing to obtain police record
                                    </Checkbox>
                                </Item>
                            </Col>
                            <Col xs={24} className="mt-4">
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading}>
                                        Submit
                                    </Button>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <div className="text-sm font-medium flex justify-center">
                                    <div>Already a Cart2Curb driver?</div>
                                    <div className="ml-2 text-blue-600 text-sm font-medium">Login</div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </DriverPage>
    )
}

export default Register;