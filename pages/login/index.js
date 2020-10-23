import React from 'react';
import { Button, Input, Form, Row, Col, Space } from 'antd';
import Link from 'next/link';

import Page from '../../components/Page';
import { GoogleIcon, FacebookIcon } from "../../components/icons";
import routes from "../../constants/routes";

const { Item } = Form;

const Login = props => {
    const [form] = Form.useForm();

    return (
        <Page title={'login'} breadcrumb={[{ title: 'Login' }]}>
            <Row>
                <Col lg={{ span: 6, offset: 9}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Item name={'email'} label={'Email Address'}>
                            <Input placeholder="Email Address" className={'mb-3'} />
                        </Item>
                        <Item name={'password'} label={'Password'}>
                            <Input type="password" placeholder="Password" className={'mb-3'} />
                        </Item>
                        <Item>
                            <Button type="primary" block>
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

export default Login;