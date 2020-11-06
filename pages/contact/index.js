import React from 'react';
import {Row, Form, Col, Input, Button, message as antMessage} from 'antd';

import Page from '../../components/Page';
import ContactSubFooter from "../../components/UI/ContactSubFooter";
import {useDispatch, useSelector} from "react-redux";

const { Item } = Form;

const Contact = props => {
    const [form] = Form.useForm()
    const loading = useSelector(state => state.loading.effects.app.contact);
    const dispatch = useDispatch();

    const submitHandler = async (values) => {
        const { name, phone, subject, message } = values;
        const body = {
            name, phone, subject, message
        }
        const res = await dispatch.app.contact(body)
        if(res) {
            antMessage.success('Thanks, We will review your message and get in touch in 48 hours!')
            form.resetFields(['name', 'phone', 'subject', 'message'])
        } else {
            antMessage.error('An Error was occurred, please try again later');
        }
    }

    const checkValidation = (errorInfo) => {
        antMessage.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <>
            <div className="layout__section">
                <Page title={false} headTitle={'Contact Us'} breadcrumb={[{ title: "Contact Us"}]}>
                    <h1 className={'mt-0 mb-4 text-2xl text-type font-medium'}>Get in Touch</h1>
                    <p className="text-paragraph mt-0 mb-12 md:mb-19 text-base">If you have any questions, you can contact us via the form below or get in touch with us directly: </p>
                    <Form form={form} layout={'vertical'} onFinishFailed={checkValidation} onFinish={submitHandler}>
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'name'} label={'Name'} rules={[
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                    {
                                        min: 3,
                                        message: 'Name field should be more than 3 characters'
                                    }
                                ]}>
                                    <Input placeholder={'Name'} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'phone'} label={'Phone Number'} rules={[
                                    {
                                        required: true,
                                        message: "Phone Number is required"
                                    },
                                    {
                                        pattern: /^[1-9][0-9]{2,14}$/,
                                        message: 'Please enter valid Phone Number',
                                    }
                                ]}>
                                    <Input placeholder={'Phone Number'} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'subject'} label={'Subject'} rules={[
                                    {
                                        required: true,
                                        message: "Subject is required",
                                    }
                                ]}>
                                    <Input placeholder={'Subject'} />
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'message'} label={'Message'} rules={[
                                    {
                                        required: true,
                                        message: 'Message is required'
                                    }
                                ]}>
                                    <Input.TextArea placeholder={'Message'} autoSize={{ minRows: 4, maxRows: 9}} style={{ resize: 'none'}} />
                                </Item>
                            </Col>
                            <Col xs={24} className={'flex flex-row-reverse'}>
                                <Item>
                                    <Button type={'primary'} className={'w-32'} htmlType={'submit'} loading={loading}>
                                        Send
                                    </Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Page>
            </div>
            <ContactSubFooter/>
        </>
    )
}

Contact.getInitialProps = async () => {

    return { forceLayout: true }
}

export default Contact;