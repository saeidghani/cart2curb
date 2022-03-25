import React, { useEffect } from 'react';
import {Button, Input, Form, Row, Col, Space, message} from 'antd';
import Link from 'next/link';

import Page from '../../components/Page';
import { GoogleIcon, FacebookIcon } from "../../components/icons";
import routes from "../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import { useAuth } from "../../providers/AuthProvider";
import withoutAuth from "../../components/hoc/withoutAuth";
import {useRouter} from "next/router";

const { Item } = Form;

let popup;

const Login = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.auth.login);
    const dispatch = useDispatch();
    const { setAuthenticated, setUserType } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(router && router?.query?.error) {
            switch(router?.query?.error) {
                case "email_user": {
                    message.error("Email already exists");
                    break;
                }
            }
        }
    }, [router?.query?.error])

    const submitHandler = async (values) => {
        const { username, password } = values;
        const body = {
            username, password
        }
        const res = await dispatch.auth.login(body)
        if(res) {
            setAuthenticated(true);
            setUserType('customer')
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const openLoginWindow = (provider) => {
        popup = window?.open(provider === 'google' ? '/v1/customer/auth/google' : '/v1/customer/auth/facebook', '_blank', ``)
    }

    return (
        <Page title={'Login'} breadcrumb={[{ title: 'Login' }]}>
            <Row>
                <Col xl={{ span: 8, offset: 8}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
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
                                    <Input placeholder="Email Address" />
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'password'} label={'Password'} rules={[
                                    {
                                        required: true,
                                        message: "Password Field is required"
                                    }
                                ]}>
                                    <Input.Password placeholder="Password" />
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading} className={'text-base'}>
                                        Login
                                    </Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className="pt-7.5 pb-16 text-center">
                        <Link href={routes.auth.forgetPassword}>
                            <span className="text-label font-medium text-base cursor-pointer">
                                Forget Password?
                            </span>
                        </Link>
                    </div>

                    <div className="mb-16 flex flex-col lg:flex-row w-full">
                            <Button
                                size="large"
                                style={{ height: '50px' }}
                                className="flex flex-row-reverse text-center justify-center lg:pl-6 lg:pr-3 items-center text-14px border border-secondary flex-1 mb-4 lg:mb-0 mr-0 lg:mr-3"
                                icon={<GoogleIcon />}
                                onClick={openLoginWindow.bind(this, 'google')}
                            >
                                <span className="pr-7">
                                    Continue With
                                </span>
                            </Button>
                            <Button
                                size="large"
                                style={{ height: '50px' }}
                                className="flex flex-row-reverse text-center justify-center lg:pl-6 lg:pr-3 items-center text-14px border border-secondary flex-1"
                                icon={<FacebookIcon />}
                                onClick={openLoginWindow.bind(this, 'facebook')}
                            >
                                <span className="pr-7">
                                    Continue With
                                </span>
                            </Button>
                    </div>

                    <div className="flex flex-row text-center items-center justify-center">
                        <span className="font-medium text-secondary text-base">Do not have an account?</span>
                        <Link href={routes.auth.register.index}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base">Register</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default withoutAuth(Login, 'customer');