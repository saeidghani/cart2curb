import React from 'react';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, Row, Space} from "antd";
import routes from "../../../constants/routes";

const { Item } = Form;

const ChangePassword = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: 'Change Password'
        }
    ]

    return (
        <Page title={'Change Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 6, offset: 9}} lg={{ span: 8, offset: 8}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Item name={'old-password'} label={'Current Password'}>
                            <Input type={'password'} placeholder='Current Password' className={'mb-3'} />
                        </Item>
                        <Item name={'password'} label={'New Password'}>
                            <Input type={'password'} placeholder='New Password' className={'mb-3'} />
                        </Item>
                        <Item name={'password-confirm'} label={'New Password Confirm'}>
                            <Input type={'password'} placeholder='New Password Confirm' className={'mb-3'} />
                        </Item>
                        <div>
                            <Space size={20} className="flex justify-end items-center">
                                <Button danger className={'w-32'}>
                                    Cancel
                                </Button>
                                <Button type="primary" className={'w-32'}>
                                    Save
                                </Button>
                            </Space>
                        </div>
                    </Form>

                </Col>
            </Row>
        </Page>
    )
}

export default ChangePassword;