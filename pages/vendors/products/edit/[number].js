import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, Upload, Radio, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";

import Page from "../../../../components/Page";
import routes from "../../../../constants/routes";

const { Item } = Form;
const { Option } = Select;

const EditProduct = props => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [unitType, setUnitType] = useState('quantity');
    const [form] = Form.useForm();

    const onChangeUnitType = (e) => {
        setUnitType(e.target.value);
    }

    useEffect(() => {
        if(router) {
            setName(router.query.number);
        }
    }, [router])

    const breadcrumb = [
        {
            title: 'Store',
            href: routes.vendors.index
        },
        {
            title: 'Edit Product',
        }
    ]

    const fileList = [
        {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'xxx2.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-3',
            name: 'xxx3.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-4',
            name: 'xxx4.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ];
    return (
        <Page title={`Edit Product #${name}`} breadcrumb={breadcrumb}>
            <Form form={form} layout={'vertical'}>
                <Row gutter={24}>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'name'} label={'Name'}>
                            <Input placeholder={'Name'} value={name} disabled/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'unitType'} label={'Unit Type'}>
                            <Radio.Group onChange={onChangeUnitType} className={'flex flex-row items-center'}>
                                <Radio value={'quantity'} className={'flex-grow'}>Quantity</Radio>
                                <Radio value={'weight'} className={'flex-grow'}>Weight</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                    {unitType === 'quantity' ? (
                        <Col xs={24} md={12} lg={8}>
                            <Item name={'unitPrice'} label={'Price per Unit'}>
                                <Input placeholder={'Price per Unit'}/>
                            </Item>
                        </Col>
                    ) : (
                        <>
                            <Col xs={24} md={12} lg={8}>
                                <Item name={'weightUnit'} label={'Weight Unit'}>
                                    <Select placeholder={'Select Weight Unit'}>
                                        <Option value={'g'}>g</Option>
                                        <Option value={'kg'}>kg</Option>
                                        <Option value={'pound'}>Pound</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Row gutter={24}>
                                    <Col xs={12}>
                                        <Item name={'weight'} label={'Weight'}>
                                            <Input placeholder={'Weight'}/>
                                        </Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Item name={'unitPrice'} label={'Price per Weight'}>
                                            <Input placeholder={'Price per Weight'}/>
                                        </Item>
                                    </Col>
                                </Row>
                            </Col>
                        </>
                    )}

                    <Col xs={24} md={12} lg={8}>
                        <Item name={'category'} label={'Category'}>
                            <Select placeholder={'Category'}>
                                {[...Array(10)].map((item, index) => {
                                    return (
                                        <Option value={`cat-${index + 1}`} key={`cat-${index + 1}`}>Cat #{index + 1}</Option>
                                    )
                                })}
                            </Select>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'tax'} label={'Tax'}>
                            <Input placeholder={'Tax'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'costPrice'} label={'Cost Price'}>
                            <Input placeholder={'Cost Price'}/>
                        </Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Item name={'stock'} label={'Stock'}>
                            <Input placeholder={'Stock'}/>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item name={'images'}>
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                defaultFileList={[...fileList]}
                            >

                                <div className={'flex items-center flex-col justify-center'}>
                                    <PlusOutlined />
                                    <div className={'pt-2'}>Upload</div>
                                </div>
                            </Upload>
                        </Item>
                    </Col>
                    <Col xs={24}>
                        <Item name={'description'} label={'Description'}>
                            <Input.TextArea placeholder={'Description'} autoSize={{ minRows: 4, maxRows: 9}}/>
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-row-reverse md:mt-12 mt-6'}>
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

export default EditProduct;