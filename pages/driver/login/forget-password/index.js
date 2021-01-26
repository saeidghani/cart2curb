import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Input, message, Row} from "antd";
import DriverPage from '../../../../components/DriverPage';
const { Item } = Form;

const ForgetPassword = props => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector(state => state?.loading?.effects?.driverAuth?.forgetPassword);

    const submitHandler = (values) => {
        const { email } = values;
        const body = {
            email
        };
        dispatch?.driverAuth?.forgetPassword(body);
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo?.errorFields[0]?.errors[0], 5);
    }

    return (
        <DriverPage title={'Forgot Password'} breadcrumb={breadcrumb}>
            <Row>
                <Col xl={{ span: 8, offset: 8}} lg={{ span: 14, offset: 5}} md={{ span: 14, offset: 5}} sm={{ span: 20, offset: 2}} xs={24}>
                    <Form
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Item name={'email'} label={'Email Address'} rules={[
                            {
                                required: true,
                                message: "Please enter your Email Address"
                            },
                            {
                                pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                message: "Please enter valid Email Address"
                            }
                        ]}>
                            <Input placeholder="Email Address" className={'mb-3'} />
                        </Item>
                        <Item>
                            <Button type="primary" block htmlType={'submit'} loading={loading}>
                                Submit
                            </Button>
                        </Item>
                    </Form>
                </Col>
            </Row>
        </DriverPage>
    )
}
export default ForgetPassword;