import React from 'react';
import { Form, Row, Col, Input, Select, Button } from 'antd';

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";

const { Item } = Form;
const { Option } = Select;

const ChangePassword = props => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: 'Vendor Profile',
            href: routes.vendors.account.index
        },
        {
            title: 'Change Password',
        }
    ]
    return (
        <Page title={'Change Password'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'}>
                <Row gutter={24}>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'currentPassword'} label={'Current Password'}>
                            <Input placeholder={'Current Password'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'password'} label={'New Password'}>
                            <Input placeholder={'New Password'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'passwordConfirm'} label={'New Password Confirm'}>
                            <Input placeholder={'New Password Confirm'}/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-row-reverse md:mt-16 mt-6'}>
                        <Item>
                            <Button type="primary" block className={'w-32 ml-5'}>
                                Save
                            </Button>
                        </Item>
                        <Item>
                            <Button danger className={'w-32'}>Cancel</Button>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    )
}

export default ChangePassword;