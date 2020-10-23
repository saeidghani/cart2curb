import React from 'react';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, Row} from "antd";

const { Item } = Form;

const ResetPassword = props => {
    const [form] = Form.useForm();

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

    return (
        <Page title={'Reset Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 6, offset: 9}} lg={{ span: 8, offset: 8}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Item name={'password'} label={'New Password'}>
                            <Input type={'password'} placeholder='New Password' className={'mb-3'} />
                        </Item>
                        <Item name={'password-confirm'} label={'New Password Confirm'}>
                            <Input type={'password'} placeholder='New Password Confirm' className={'mb-3'} />
                        </Item>
                        <Item>
                            <Button type="primary" block>
                                Submit
                            </Button>
                        </Item>
                    </Form>

                </Col>
            </Row>
        </Page>
    )
}

export default ResetPassword;