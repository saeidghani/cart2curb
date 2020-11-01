import React from 'react';
import {Button, Input, Table, Checkbox, InputNumber, Row, Col, Form, Select } from 'antd';
import Page from "../../components/Page";

const { Item } = Form;
const { Option } = Select;

export const CartIndex = () => {
    const [form] = Form.useForm()

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Substitutions',
            dataIndex: 'substitutions',
            key: 'substitutions',
            render: substitutions => {
                return (
                    <Checkbox className={'text-cell checkbox-info'}>{substitutions ? "Yes" : "No"}</Checkbox>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Quantity/Weight',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 160
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 210
        },
    ];

    const fakeData = [...Array(3)].map((item, index) => {
        return {
            key: index + 1,
            index: index + 1,
            product: 'Choice Beef Brisket Chunk',
            substitutions: false,
            price: '$150.00',
            tax: '$20.50',
            store: 'Store name',
            quantity: (
                <InputNumber min={1} defaultValue={3} size={'sm'} className={'cart-number-input'} />
            ),
            total: "$160.00"
        }
    })

    return (
        <Page title="Cart" breadcrumb={[{ title: 'Cart'}]}>
            <div className="mt-2">
                <Table columns={columns}
                       dataSource={fakeData}
                       pagination={false}
                />
            </div>
            <div className={'flex flex-row-reverse items-start pt-6 pb-8'}>
                <div className="flex flex-col pl-4" style={{ width: 210 }}>
                    <h1 className="text-left text-4.5xl text-paragraph font-medium mb-2 mt-0">$$$</h1>
                    <span className="text-xs text-header">+ $15 Service Fee</span>
                </div>
            </div>

                <Form form={form} layout={'vertical'}>
                    <Row gutter={24}>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-1'} label={'Item #1 Substitution'}>
                                <Select placeholder={'I need exact item (Do not substitute)'}>
                                    <Option value={'exact'}>I need exact item (Do not substitute)</Option>
                                    <Option value={'substitute'}>Do substitute</Option>
                                </Select>
                            </Item>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-2'} label={'Item #2 Substitution'}>
                                <Select placeholder={'I need exact item (Do not substitute)'}>
                                    <Option value={'exact'}>I need exact item (Do not substitute)</Option>
                                    <Option value={'substitute'}>Do substitute</Option>
                                </Select>
                            </Item>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-3'} label={'Item #3 Substitution'}>
                                <Select placeholder={'I need exact item (Do not substitute)'}>
                                    <Option value={'exact'}>I need exact item (Do not substitute)</Option>
                                    <Option value={'substitute'}>Do substitute</Option>
                                </Select>
                            </Item>
                        </Col>
                        <Col xs={24}>
                            <Item name={'notes'} label={'Notes'}>
                                <Input.TextArea placeholder="Notes" style={{ resize: 'none' }} autoSize={{ minRows: 5, maxRows: 8 }} />
                            </Item>
                        </Col>
                        <Col xs={24} className={'flex flex-row-reverse'}>
                            <Item>
                                <Button type={'primary'} className="w-32 mt-8">Next</Button>
                            </Item>
                        </Col>
                    </Row>
                </Form>
        </Page>
    );
};

export default CartIndex;
