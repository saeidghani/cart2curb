import React from 'react';
import {Form, Row, Col, Input, Select, Button, message} from 'antd';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import withAuth from "../../../../components/hoc/withAuth";

const { Item } = Form;
const { Option } = Select;

const ChangePassword = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.vendorAuth.changePassword);

    const breadcrumb = [
        {
            title: 'Vendor Profile',
            href: routes.vendors.account.index
        },
        {
            title: 'Change Password',
        }
    ]

    const submitHandler = (values) => {
        const { currentPassword, newPassword} = values;
        const body = {
            currentPassword, newPassword
        }

        dispatch.vendorAuth.changePassword(body)
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }
    return (
        <Page title={'Change Password'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'}
                  onFinish={submitHandler}
                  onFinishFailed={checkValidation}>
                <Row gutter={24}>
                    <Col xs={24} md={12} lg={8}>
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
                    <Col xs={24} md={12} lg={8}>
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
                    <Col xs={24} md={12} lg={8}>

                        <Item
                            name={'newPasswordConfirm'}
                            label={'Confirm New Password'}
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
                            <Input.Password placeholder='Confirm New Password' />
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-32 ml-5'} loading={loading} htmlType={'submit'}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Link href={routes.vendors.account.index}>
                                <Button danger className={'w-32'}>Cancel</Button>

                            </Link>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default withAuth(ChangePassword, 'vendor');