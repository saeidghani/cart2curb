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
                            }, // @todo: add pattern
                            // {
                            //     pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                            //     message: "Please enter valid Email Address"
                            // }
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
                    <div className="pt-11 mb-24 text-center">
                        <Link href={routes.vendors.auth.forgetPassword}>
                            <span className="text-label font-medium text-xl cursor-pointer">
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