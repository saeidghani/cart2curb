import React from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import Link from 'next/link';

import Page from '../../../components/Page';
import routes from "../../../constants/routes";

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
                    <div className="pt-11 mb-24 text-center">
                        <Link href={routes.vendors.auth.forgetPassword}>
                            <span className="text-label font-medium text-xl cursor-pointer">
                                Forget Password?
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-row text-center items-center justify-center">
                        <Link href={routes.vendors.auth.login}>
                            <a className="text-info font-medium cursor-pointer text-base">Ask us to host your local products</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default Login;