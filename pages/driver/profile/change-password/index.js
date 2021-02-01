import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col, message
} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import DriverPage from '../../../../components/DriverPage';
import DriverAuth from '../../../../components/Driver/DriverAuth';
import routes from "../../../../constants/routes";

const {Item} = Form;

const EditCustomer = props => {
    const loading = useSelector(state => state?.loading?.effects?.adminUser?.getCustomer);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const token = useSelector(state => state?.driverAuth?.token);

    const submitHandler = async (values) => {
        const {currentPassword, newPassword} = values;

        const body = {
            currentPassword,
            newPassword
        };
        await dispatch?.driverAuth?.changePassword({body, token});
    };

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    };

    return (
        <DriverAuth>
            <DriverPage title={'Change Password'}>
                <Row>
                    <Col span={24}>
                        <Form
                            form={form}
                            layout="vertical"
                            className="flex flex-col"
                            onFinishFailed={checkValidation}
                            onFinish={submitHandler}
                        >
                            <Row gutter={24}>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name="currentPassword" label={'Current Password'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Please input your password!',
                                              },
                                              {
                                                  min: 6,
                                                  message: "Password should be 6 characters at least"
                                              }
                                          ]}>
                                        <Input.Password placeholder="Current Password"/>
                                    </Item>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item name="newPassword" label={'New Password'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Please input your password!',
                                              },
                                              {
                                                  min: 6,
                                                  message: "Password should be 6 characters at least"
                                              }
                                          ]}>
                                        <Input.Password placeholder="New Password"/>
                                    </Item>
                                </Col>
                                <Col lg={8} md={12} xs={24}>
                                    <Item
                                        name="newPasswordConfirm"
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
                                        <Input.Password placeholder="Confirm New Password"/>
                                    </Item>
                                </Col>
                                <Col xs={24} className="mt-4">
                                    <Item>
                                        <Button type="primary" block htmlType={'submit'} loading={loading}>
                                            Save Changes
                                        </Button>
                                    </Item>
                                </Col>
                                <Col xs={24}>
                                    <Item>
                                        <Link href={routes.driver.profile.index}><Button
                                            className="w-full p-3 border border-red-500 border-solid text-red-500 text-center font-medium text-sm mr-1"
                                        >
                                            Cancel
                                        </Button></Link>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </DriverPage>
        </DriverAuth>
    )
}

export default EditCustomer;