import React from 'react';
import {Button, Input, Form, Row, Col, message} from 'antd';
import {  GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import Link from 'next/link';
import {useDispatch, useSelector} from "react-redux";
import DriverPage from '../../../components/DriverPage';
import routes from "../../../constants/routes";
import {useRouter} from "next/router";
const {Item} = Form;

const Login = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state?.loading?.effects?.driverAuth?.login);
    const dispatch = useDispatch();
    const router = useRouter();

    const getNewPath = () => router.query.prevPath || routes.driver.deliveries.available;

    const submitHandler = async (values) => {
        const {username, password} = values;
        const body = {
            username, password
        }
        try {
            const res = await dispatch?.driverAuth?.login(body);
            const newPath = getNewPath();
            const {token} = res?.data || {};
            if (token) {
                await dispatch?.driverProfile?.getProfile({token});
                setTimeout(() => window.location.replace(newPath), 1000);
            }
        } catch (err) {

        }
    }
    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    }
    return (
        <DriverPage title={'Login'}>
            <Row>
                <Col xl={{span: 6, offset: 9}} lg={{span: 14, offset: 5}} md={{span: 14, offset: 5}}
                     sm={{span: 16, offset: 4}} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row>
                            <Col xs={24}>
                                <Item name={'username'} label={'Email Address'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Email Address"
                                    },
                                    {
                                        pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                        message: "Please enter valid Email Address"
                                    }
                                ]}>
                                    <Input placeholder="Email Address"/>
                                </Item>

                            </Col>
                            <Col xs={24}>
                                <Item name={'password'} label={'Password'} rules={[
                                    {
                                        required: true,
                                        message: "Password Field is required"
                                    },
                                    {
                                        min: 6,
                                        message: "Password should be 6 characters at least"
                                    }
                                ]}>
                                    <Input.Password placeholder="Password"/>
                                </Item>
                            </Col>
                            <Col xs={24}>
                            <div className="pt-7.5 pb-16 md:pb-24 text-center">
                                <Link href={routes?.driver?.auth?.forgetPassword}>
                                    <span className="text-label font-medium text-base cursor-pointer text-type">
                                        Forget Password?
                                    </span>
                                </Link>
                            </div>
                            </Col>
                            <Col xs={24}>
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading}>
                                        Login
                                    </Button>
                                </Item>
                            </Col>

                        </Row>
                    </Form>                  
                    <div className="flex items-center">
                            <Button className="w-1/2 flex items-center p-4 border border-current border-solid flex font-medium text-sm mr-1">Continue with <GoogleOutlined className="ml-1 text-red-700"/></Button>
                            <Button className="w-1/2 flex items-center p-4 border border-current border-solid flex font-medium text-sm ml-1 ">Continue with <FacebookFilled className="ml-1 text-blue-700"/></Button>
                    </div>

                    <div className="flex flex-row text-center items-center justify-center mt-9">
                        Do not have an account?
                        <a className="font-medium cursor-pointer text-base text-blue-500 ml-2">Register</a>
                    </div>
                </Col>
            </Row>
        </DriverPage>
    )
}
export default Login;