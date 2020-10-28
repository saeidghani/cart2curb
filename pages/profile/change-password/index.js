import React from 'react';

import Page from '../../../components/Page';
import {Button, Col, Form, Input, message, Row, Space} from "antd";
import routes from "../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import withAuth from "../../../components/hoc/withAuth";

const { Item } = Form;

const ChangePassword = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.auth.changePassword);

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: 'Change Password'
        }
    ]

    const submitHandler = (values) => {
        const { currentPassword, newPassword} = values;
        const body = {
            currentPassword, newPassword
        }

        dispatch.auth.changePassword(body)
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={'Change Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 6, offset: 9}} lg={{ span: 8, offset: 8}} md={{ span: 12, offset: 6 }} sm={{ span: 16, offset: 4 }} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Item
                            name={'currentPassword'}
                            label={'Current Password'}

                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    min: 6,
                                    message: "Password should be at least 6 character"
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Current Password' />
                        </Item>
                        <Item
                            name={'newPassword'}
                            label={'New Password'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    min: 6,
                                    message: "Password should be at least 6 character"
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='New Password' />
                        </Item>
                        <Item
                            name={'newPasswordConfirm'}
                            label={'New Password Confirm'}
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}>
                            <Input.Password placeholder='New Password Confirm' />
                        </Item>
                        <div>
                            <Space size={20} className="flex justify-end items-center">
                                <Button danger className={'w-32'}>
                                    Cancel
                                </Button>
                                <Button type="primary" className={'w-32'} htmlType={'submit'} loading={loading}>
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


export default withAuth(ChangePassword);