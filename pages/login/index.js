import React, { useEffect } from 'react';
import {Button, Input, Form, Row, Col, Space, message} from 'antd';
import Link from 'next/link';

import Page from '../../components/Page';
import { GoogleIcon, FacebookIcon } from "../../components/icons";
import routes from "../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectAuthenticated} from "../../hooks/auth";
import { useAuth } from "../../providers/AuthProvider";
import withoutAuth from "../../components/hoc/withoutAuth";

const { Item } = Form;

const Login = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.auth.login);
    const dispatch = useDispatch();
    const redirect = useRedirectAuthenticated();
    const { setAuthenticated } = useAuth();

    useEffect(() => {
        redirect();
    }, [redirect])

    const submitHandler = async (values) => {
        const { username, password } = values;
        const body = {
            username, password
        }
        const res = await dispatch.auth.login(body)
        if(res) {
            setAuthenticated(true);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


    return (
        <Page title={'login'} breadcrumb={[{ title: 'Login' }]}>
            <Row>
                <Col lg={{ span: 6, offset: 9}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
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
                            <Input placeholder="Email Address" className={'mb-3'} />
                        </Item>
                        <Item name={'password'} label={'Password'} rules={[
                            {
                                required: true,
                                message: "Password Field is required"
                            }
                        ]}>
                            <Input type="password" placeholder="Password" className={'mb-3'} />
                        </Item>
                        <Item>
                            <Button type="primary" block htmlType={'submit'} loading={loading}>
                                Login
                            </Button>
                        </Item>
                    </Form>
                    <div className="pt-11 pb-14 text-center">
                        <Link href={routes.auth.forgetPassword}>
                            <span className="text-label font-medium text-xl cursor-pointer">
                                Forget Password?
                            </span>
                        </Link>
                    </div>

                    <div className="mb-16 flex flex-row w-full">
                        <Button size="large" className="flex flex-row-reverse text-center justify-between pl-6 pr-3 items-center text-14px border border-secondary flex-1 mr-3" icon={<GoogleIcon />}>
                            Continue With
                        </Button>
                        <Button size="large" className="flex flex-row-reverse text-center justify-between pl-6 pr-3 items-center text-14px border border-secondary flex-1" icon={<FacebookIcon />}>
                            Continue With
                        </Button>
                    </div>

                    <div className="flex flex-row text-center items-center justify-center">
                        <h4 className="font-medium text-secondary text-base">Do not have an account?</h4>
                        <Link href={routes.auth.register.index}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base">Register</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default withoutAuth(Login);