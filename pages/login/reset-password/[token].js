import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, message, Row} from "antd";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectAuthenticated} from "../../../hooks/auth";
import withoutAuth from "../../../components/hoc/withoutAuth";
import Submitted from '../../../components/Submitted';

const { Item } = Form;

const ResetPassword = props => {
    const [form] = Form.useForm();
    const router = useRouter();
    const loading = useSelector(state => state.loading.effects.auth.resetPassword);
    const dispatch = useDispatch()
    const redirect = useRedirectAuthenticated();
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        redirect();
    }, [redirect])


    const breadcrumb = [
        {
            title: "Login",
            href: '/login'
        },
        {
            title: 'Forgot Password',
            href: '/login/forget-password',
        },
        {
            title: 'Reset Password',
        }
    ]

    useEffect(() => {
        let token = router.query.token || undefined;
        if((typeof token === 'string' && token.length === 0)) {
            message.error('Please use valid reset password link!', 5);
            router.push(routes.auth.login);
        }
    }, [router])


    const submitHandler = async (values) => {
        const { password } = values;
        const body = {
            newPassword: password,
            token: router.query.token
        }
        const res = await dispatch.auth.resetPassword(body)
        if(res) {
            setSubmitted(true);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


    return (
        <Page title={submitted ? false : 'Reset Password'} breadcrumb={submitted ? [] : breadcrumb}>
            {submitted ? (
                <Submitted/>
            ) : (
                <Row>
                    <Col xl={{ span: 8, offset: 8}}  lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                        <Form
                            form={form}
                            layout="vertical"
                            className="flex flex-col"
                            onFinish={submitHandler}
                            onFinishFailed={checkValidation}
                        >
                            <Row>
                                <Col xs={24}>
                                    <Item name={'password'}
                                          label={'New Password'}
                                          hasFeedback
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Please input your password!',
                                              },
                                              {
                                                  min: 6,
                                                  message: "Password should be at least 6 character"
                                              }
                                          ]}>
                                        <Input.Password placeholder="New Password"/>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item name={'password-confirm'}
                                          label={'New Password Confirm'}
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
                                        <Input.Password placeholder="New Password Confirm"/>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item className={'mb-0'}>
                                        <Button type="primary" htmlType={'submit'} block loading={loading} className={'text-base'}>
                                            Submit
                                        </Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>

                    </Col>
                </Row>
            )}

        </Page>
    )
}

export default withoutAuth(ResetPassword, 'customer');