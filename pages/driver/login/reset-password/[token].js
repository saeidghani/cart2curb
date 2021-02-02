import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Input, message, Row} from "antd";

import DriverPage from '../../../../components/Driver/DriverPage';
import routes from "../../../../constants/routes";
import {useRouter} from "next/router";
import Success from "../../../../components/Driver/Success";
const { Item } = Form;

const ResetPassword = props => {
    const [form] = Form.useForm();
    const router = useRouter();
    const loading = useSelector(state => state?.loading?.effects?.driverAuth?.resetPassword);
    const dispatch = useDispatch()
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        let token = router.query?.token || undefined;
        if((typeof token === 'string' && token?.length === 0)) {
            message.error('Please use valid reset password link!', 5);
            router.push(routes?.driver?.auth?.login);
        }
    }, [router])
    const submitHandler = async (values) => {
        const { password } = values;
        const body = {
            newPassword: password,
            token: router.query?.token
        }
        const res = await dispatch?.driverAuth?.resetPassword(body)
        if(res) {
            setSubmitted(true);
        }
    }
    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    }
    return (
        <DriverPage title={submitted ? false : 'Reset Password'} >
            {submitted ? (
                <Success href={routes.driver.auth.login}/>
            ) : (
                <Row>
                    <Col xl={{ span: 8, offset: 8}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                        <Form
                            form={form}
                            layout="vertical"
                            className="flex flex-col"
                            onFinish={submitHandler}
                            onFinishFailed={checkValidation}
                        >
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
                            <Item name={'password-confirm'}
                                  label={'Confirm New Password'}
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
                                <Input.Password placeholder="Confirm New Password"/>
                            </Item>
                            <Item>
                                <Button type="primary" htmlType={'submit'} block loading={loading}>
                                    Submit
                                </Button>
                            </Item>
                        </Form>

                    </Col>
                </Row>
            )}
        </DriverPage>
    )
}
export default ResetPassword;