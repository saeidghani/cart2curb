import React from 'react';
import {Button, Input, Table, Checkbox, InputNumber, Row, Col, Form } from 'antd';
import Page from "../../components/Page";

const { Item } = Form;

export const CartIndex = () => {
    const [form] = Form.useForm()

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Substitutions',
            dataIndex: 'substitutions',
            key: 'substitutions',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
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
            substitutions: (
                <Checkbox>Yes</Checkbox>
            ),
            price: '$150.00',
            tax: '$20.50',
            store: 'Store name',
            quantity: (
                <InputNumber min={1} defaultValue={3} />
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
                <span className="col-span-2 text-left pl-4 pt-4 text-sm text-paragraph" style={{ width: 160 }}>10</span>
            </div>

                <Form form={form} layout={'vertical'}>
                    <Row gutter={24}>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-1'} label={'Item #1 Substitution'}>
                                <Input placeholder="I need exact item (Do not substitute)" />
                            </Item>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-2'} label={'Item #2 Substitution'}>
                                <Input placeholder="I need exact item (Do not substitute)" />
                            </Item>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                            <Item name={'item-3'} label={'Item #3 Substitution'}>
                                <Input placeholder="I need exact item (Do not substitute)" />
                            </Item>
                        </Col>
                        <Col xs={24}>
                            <Item name={'notes'} label={'Notes'}>
                                <Input.TextArea placeholder="I need exact item (Do not substitute)" autoSize={{ minRows: 3, maxRows: 8 }} />
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
