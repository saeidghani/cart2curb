import React, { useMemo } from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import routes from "../../constants/routes";
import Link from "next/link";
import deleteModal from "../Modals/Delete";

const { Item } = Form;
const { Option } = Select;

const Categories = props => {
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Title",
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: "Description",
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: "Action",
            dataIndex: 'actions',
            key: 'actions',
            render: (actions, row) => {
                return (
                    <Space size={4}>
                        <Link href={routes.vendors.categories.edit()} as={routes.vendors.categories.edit(row.title)}>
                            <Button type={'link'} shape={'circle'} icon={<EditOutlined className={'text-secondarey text-xl'} />} />
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'} />} onClick={actions.deleteHandler} />
                    </Space>
                )
            },
            width: 130,
            fixed: 'right',
        },
    ]

    const fakeData = useMemo(() => {
        return [...Array(60)].map((item, index) => {
            return {
                key: index + 1,
                index: index + 1,
                title: `C${123456 + index}`,
                description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: () => console.log('you deleted category'),
                            okText: 'Ok',
                            title: 'Do you want to delete this Category?',
                            content: 'Are you sure to delete this category? There is no going back!!',
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
                                <Item name={'parentCategory'} label={'Parent Category'}>
                                    <Select placeholder={'Parent Category'}>
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
                    <Link href={routes.vendors.categories.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{ fontSize: 20 }}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                        >
                            Add New Category
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={fakeData} scroll={{ x: 990 }}/>
                </Col>
            </Row>
        </>
    )
}

export default Categories;