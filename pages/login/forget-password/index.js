import React, { useEffect } from 'react';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, message, Row} from "antd";
import Link from "next/link";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectAuthenticated} from "../../../hooks/auth";
import withoutAuth from "../../../components/hoc/withoutAuth";

const { Item } = Form;

const ForgetPassword = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.auth.forgetPassword);

    const redirect = useRedirectAuthenticated();

    useEffect(() => {
        redirect();
    }, [redirect])


    const breadcrumb = [
        {
            title: "Login",
            href: '/login'
        },
        {
            title: 'Forgot Password'
        }
    ]

    const submitHandler = (values) => {
        const { email } = values;
        const body = {
            email
        }
        dispatch.auth.forgetPassword(body)
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


    return (
        <Page title={'Forgot Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 8, offset: 8}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                    <p className="text-paragraph text-base mb-6 mt-2">Please enter your email associated with your account.</p>
                    <Form
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                        form={form}
                        layout="vertical"
                    >
                        <Row>
                            <Col xs={24}>
                                <Item name={'email'} label={'Email Address'} className={'mb-8'} rules={[
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
                                <Item>
                                    <Button type="primary" htmlType={'submit'} block loading={loading} className={'text-base'}>
                                        Submit
                                    </Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>

                    <div className="flex flex-row text-center items-center justify-center mt-15">
                        <h4 className="font-medium text-secondary text-base">Remembered your password?</h4>
                        <Link href={routes.auth.login}>
                            <a className="pl-2 text-info font-medium cursor-pointer text-base">Login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default withoutAuth(ForgetPassword, 'customer');