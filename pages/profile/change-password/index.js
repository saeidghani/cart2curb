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
                <Col xl={{ span: 10, offset: 7}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row>
                            <Col xs={24}>

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
                            </Col>

                            <Col xs={24}>
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
                            </Col>

                            <Col xs={24}>
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
                            </Col>

                            <Col xs={24}>
                                <div className="flex flex-col md:flex-row-reverse">
                                    <Button type="primary" className={'w-full md:w-32 md:ml-5 mb-4 md:mb-0'} htmlType={'submit'} loading={loading}>
                                        Save
                                    </Button>
                                    <Button danger className={'w-full md:w-32 '}>
                                        Cancel
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>

                </Col>
            </Row>
        </Page>
    )
}


export default withAuth(ChangePassword);