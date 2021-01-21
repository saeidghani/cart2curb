import React, {useEffect} from 'react';
import {Button, Input, Form, Row, Col, message} from 'antd';
import Link from 'next/link';
import {useDispatch, useSelector} from "react-redux";

import Page from '../../../components/Page';
import routes from "../../../constants/routes";
import {useRouter} from "next/router";

const {Item} = Form;

const Login = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state?.loading?.effects?.adminAuth?.login);
    const dispatch = useDispatch();
    const router = useRouter();

    const getNewPath = () => router.query.prevPath || routes.admin.deliveries.index;

    const submitHandler = async (values) => {
        const {username, password} = values;
        const body = {
            username, password
        }
        try {
            const res = await dispatch?.adminAuth?.login(body);
            const newPath = getNewPath();
            const {token} = res?.data || {};
            if (token) {
                await dispatch?.adminProfile?.getProfile({token});
                setTimeout(() => window.location.replace(newPath), 1000);
            }
        } catch (err) {

        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    }

    return (
        <Page title={'Login'} breadcrumb={[{title: 'Login'}]}>
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
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading}>
                                        Login
                                    </Button>
                                </Item>

                            </Col>

                        </Row>
                    </Form>
                    <div className="pt-7.5 pb-16 md:pb-24 text-center">
                        <Link href={routes?.admin?.auth?.forgetPassword}>
                            <span className="text-label font-medium text-base cursor-pointer text-type">
                                Forget Password?
                            </span>
                        </Link>
                    </div>
                    <div className="flex space-x-2 text-center items-center justify-center">
                        <span className="mr-1">Do not have an account?</span>
                        <Link href={routes?.admin?.auth?.login}>
                            <a className="text-info font-medium cursor-pointer text-base">
                                Register***
                            </a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default Login;