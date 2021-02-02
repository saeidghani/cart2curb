import React from 'react';

import Page from '../../../../components/Page';
import {Button, Col, Form, Input, message, Row} from "antd";
import routes from "../../../../constants/routes";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";

const { Item } = Form;

const ChangePassword = props => {
    const [form] = Form.useForm();
    const router = useRouter();
    const loading = useSelector(state => state?.loading?.effects?.adminProfile?.changePassword);
    const token = useSelector(state => state?.adminAuth?.token);
    const dispatch = useDispatch();

    const breadcrumb = [
        {
            title: "Profile",
            href: routes.admin.profile.index
        },
        {
            title: 'Change Password',
        }
    ]

    const submitHandler = async (values) => {
        const { currentPassword, newPassword } = values;
        const body = {
            newPassword,
            currentPassword
        }
        const res = await dispatch?.adminProfile?.changePassword({body, token});
        if(res) {
            router.push(routes.admin.profile.index);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    };


    return (
        <Page title={'Change Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 8, offset: 8}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Item name={'currentPassword'}
                              label={'Current Password'}
                              hasFeedback
                              rules={[
                                  {
                                      required: true,
                                      message: 'Please input your password!',
                                  },
                                  {
                                      min: 6,
                                      message: "Password should be at least 6 character"
                                  }
                              ]}>
                            <Input.Password placeholder="Current Password"/>
                        </Item>
                        <Item name={'newPassword'}
                              label={'New Password'}
                              hasFeedback
                              rules={[
                                  {
                                      required: true,
                                      message: 'Please input your password!',
                                  },
                                  {
                                      min: 6,
                                      message: "Password should be at least 6 character"
                                  }
                              ]}>
                            <Input.Password placeholder="New Password"/>
                        </Item>
                        <Item name={'password-confirm'}
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
                        <Item>
                            <Button type="primary" htmlType={'submit'} block loading={loading}>
                                Submit
                            </Button>
                        </Item>
                    </Form>

                </Col>
            </Row>
        </Page>
    )
}

export default ChangePassword;