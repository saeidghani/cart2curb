import React, { useMemo } from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space} from 'antd';
import {FileSearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import routes from "../../constants/routes";
import Link from "next/link";
import deleteModal from "../Modals/Delete";

const { Item } = Form;
const { Option } = Select;

const Products = props => {
    const [form] = Form.useForm();

    const columns = [
        {
            title: "#",
            dataIndex: 'number',
            key: 'number'
        },
        {
            title: "Name",
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: "Unit/Weight Price",
            dataIndex: 'unitPrice',
            key: 'unitPrice'
        },
        {
            title: "Cost Price",
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: "Tax Rate",
            dataIndex: 'tax',
            key: 'tax'
        },
        {
            title: "Stock",
            dataIndex: 'stock',
            key: 'stock'
        },
        {
            title: "Parent Categories",
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: "Action",
            dataIndex: 'actions',
            key: 'actions',
            render: (actions, row) => {
                return (
                    <Space size={4}>
                        <Link href={routes.vendors.products.view()} as={routes.vendors.products.view(row.number)}>
                            <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} />
                        </Link>
                        <Link href={routes.vendors.products.edit()} as={routes.vendors.products.edit(row.number)}>
                            <Button type={'link'} shape={'circle'} icon={<EditOutlined className={'text-secondarey text-xl'} />} />
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'} />} onClick={actions.deleteHandler} />
                    </Space>
                )
            },
            width: 170,
            fixed: 'right',
        },
    ]

    const fakeData = useMemo(() => {
        return [...Array(60)].map((item, index) => {
            return {
                key: index + 1,
                index: index + 1,
                number: `ID${123456 + index}`,
                name: 'Product Name',
                unitPrice: '$10.20',
                price: '$15.00',
                tax: '20%',
                stock: 100,
                category: 'Categories name',
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: () => console.log('you deleted product'),
                            okText: 'Ok',
                            title: 'Do you want to delete this product?',
                            content: 'Are you sure to delete this product? There is no going back!!',
                        });
                    },
                },
            }
        })
    }, [])

    return (
        <>
            <Row gutter={24} className={'flex items-center pt-17 pb-10'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'} />
                                </Item>
                            </Col>
                            <Col lg={9} xs={24}>
                                <Item name={'category'} label={'Categories'}>
                                    <Select placeholder={'Categories'}>
                                        <Option value={'food'}>Food</Option>
                                        <Option value={'vegetables'}>Vegetables</Option>
                                        <Option value={'food'}>Food</Option>
                                        <Option value={'vegetables'}>Vegetables</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7.5'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={routes.vendors.products.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{ fontSize: 20 }}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                        >
                            Add New Product
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={fakeData} scroll={{ x: 1200 }}/>
                </Col>
            </Row>
        </>
    )
}

export default Products;