import React, {useEffect} from 'react';
import {Button, Input, Form, Row, Col, message} from 'antd';
import Link from 'next/link';

import Page from '../../../components/Page';
import routes from "../../../constants/routes";
import withoutAuth from "../../../components/hoc/withoutAuth";
import {useDispatch, useSelector} from "react-redux";
import {useRedirectAuthenticated} from "../../../hooks/auth";
import {useAuth} from "../../../providers/AuthProvider";

const { Item } = Form;

const Login = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state.loading.effects.vendorAuth.login);
    const dispatch = useDispatch();
    const redirect = useRedirectAuthenticated();
    const { setAuthenticated, setUserType } = useAuth();

    useEffect(() => {
        redirect();
    }, [redirect])

    const submitHandler = async (values) => {
        const { username, password } = values;
        const body = {
            username, password
        }
        const res = await dispatch.vendorAuth.login(body)
        if(res) {
            setAuthenticated(true);
            setUserType('vendor')
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={'login'} breadcrumb={[{ title: 'Login' }]}>
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
                                ]}>
                                    <Input placeholder="Email Address" className={'mb-3'} />
                                </Item>

                            </Col>

                            <Col xs={24}>
                                <Item name={'password'} label={'Password'} rules={[
                                    {
                                        required: true,
                                        message: "Password Field is required"
                                    }
                                ]}>
                                    <Input type="password" placeholder="Password" className={'mb-3'} />
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
                        <Link href={routes.vendors.auth.forgetPassword}>
                            <span className="text-label font-medium text-xl cursor-pointer text-type">
                                Forget Password?
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-row text-center items-center justify-center">
                        <Link href={routes.vendors.auth.register.index}>
                            <a className="text-info font-medium cursor-pointer text-base">Ask us to host your local products</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default withoutAuth(Login);