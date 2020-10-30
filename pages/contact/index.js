import React from 'react';
import { Row, Form, Col, Input, Button } from 'antd';

import Page from '../../components/Page';
import ContactSubFooter from "../../components/UI/ContactSubFooter";

const { Item } = Form;

const Contact = props => {
    const [form] = Form.useForm()
    return (
        <>
            <div className="layout__section">
                <Page title={false} breadcrumb={[{ title: "Contact Us"}]}>
                    <h1 className={'mt-0 mb-4 text-2xl text-type font-medium'}>Get in Touch</h1>
                    <p className="text-paragraph mt-0 mb-12 md:mb-19 text-base">If you have any questions, you can contact us via the form below or get in touch with us directly: </p>
                    <Form form={form} layout={'vertical'}>
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'name'} label={'Name'}>
                                    <Input placeholder={'Name'} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'phone'} label={'Phone Number'}>
                                    <Input placeholder={'Phone Number'} />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'subject'} label={'Subject'}>
                                    <Input placeholder={'Subject'} />
                                </Item>
                            </Col>
                            <Col xs={24}>
                                <Item name={'message'} label={'Message'}>
                                    <Input.TextArea placeholder={'Message'} autoSize={{ minRows: 4, maxRows: 9}} style={{ resize: 'none'}} />
                                </Item>
                            </Col>
                            <Col xs={24} className={'flex flex-row-reverse'}>
                                <Item>
                                    <Button type={'primary'} className={'w-32'}>
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