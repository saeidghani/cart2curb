import React from 'react';
import {Button, Input, Form, Row, Col, message} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

import Page from '../../../../components/Page';
import routes from "../../../../constants/routes";
import Link from "next/link";

const {Item} = Form;

const ChangeEmail = props => {
    const [form] = Form.useForm();
    const loading = useSelector(state => state?.loading?.effects?.adminProfile?.editProfile);
    const token = useSelector(state => state?.adminAuth?.token);
    const dispatch = useDispatch();
    const router = useRouter();

    const submitHandler = async (values) => {
        const {email} = values;
        const body = {
            email
        }
        try {
            const res = await dispatch?.adminProfile?.editProfile({body, token});
            if (res) {
                router.push(routes.admin.profile.index);
            }
        } catch (err) {

        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    }

    return (
        <Page title='Change Email Address' breadcrumb={[{title: 'Change Email Address'}]}>
            <Row>
                <Col xl={{span: 8, offset: 8}} lg={{span: 14, offset: 5}} md={{span: 14, offset: 5}}
                     sm={{span: 20, offset: 2}} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row>
                            <Col xs={24}>
                                <Item name={'email'} label={'New Email Address'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Email Address"
                                    },
                                    {
                                        pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                        message: "Please enter valid Email Address"
                                    }
                                ]}>
                                    <Input placeholder="Email Address"/>
                                </Item>

                            </Col>
                            <Col xs={24}>
                                <Item>
                                    <Button type="primary" block htmlType={'submit'} loading={loading}>
                                        Confirm
                                    </Button>
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item>
                                    <Link href={routes.admin.profile.index}>
                                        <Button
                                            block
                                            className="w-full p-3 border border-red-500 border-solid text-red-500 text-center font-medium text-sm mr-1"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Page>
    )
}

export default ChangeEmail;