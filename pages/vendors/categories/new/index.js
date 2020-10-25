import React from 'react';
import { Form, Row, Col, Input, Select, Button } from 'antd';
import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";

const { Item } = Form;
const { Option } = Select;

const NewCategory = props => {
    const [form] = Form.useForm();


    const breadcrumb = [
        {
            title: 'Store',
            href: routes.vendors.index
        },
        {
            title: 'Add Category',
        }
    ]
    return (
        <Page title={'Add Category'} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'}>
                <Row gutter={24}>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'name'} label={'Name'}>
                            <Input placeholder={'Name'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'parentCategory'} label={'Parent Category'}>
                            <Select placeholder={'Select Weight Unit'}>
                                {[...Array(12)].map((item, index) => {
                                    return (
                                        <Option value={`C${index + 1}`} key={`cat-${index + 1}`}>C#{index + 1}</Option>
                                    )
                                })}
                            </Select>
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

export default NewCategory;