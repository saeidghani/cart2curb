import React from 'react';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, Row} from "antd";
import Link from "next/link";
import routes from "../../../constants/routes";

const { Item } = Form;

const ForgetPassword = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: "Login",
            href: '/login'
        },
        {
            title: 'Forgot Password'
        }
    ]

    return (
        <Page title={'Forgot Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 6, offset: 9}} lg={{ span: 8, offset: 8}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <p className="text-paragraph text-base mb-8">Please enter your email associated with your account.</p>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Item name={'email'} label={'Email Address'}>
                            <Input placeholder="Email Address" className={'mb-3'} />
                        </Item>
                        <Item>
                            <Button type="primary" block>
                                Submit
                            </Button>
                        </Item>
                    </Form>

                    <div className="flex flex-row text-center items-center justify-center mt-19">
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

export default ForgetPassword;