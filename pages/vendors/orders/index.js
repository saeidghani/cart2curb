import React, { useState, useMemo } from 'react';
import {Button, Col, Form, Input, Row, Table} from "antd";

import Page from "../../../components/Page";
import {FileSearchOutlined} from "@ant-design/icons";
import OrderDetailsModal from "../../../components/Modals/OrderDetails";

const { Item } = Form;

const Orders = props => {
    const [form] = Form.useForm();
    const [detailsModal, setDetailsModal] = useState(-1);


    const columns = [
        {
            title: '# Order Number',
            dataIndex: 'number',
            key: 'number',
            render: number => <span className={`text-cell`}>{number}</span>
        },
        {
            title: 'CX Name',
            dataIndex: 'name',
            key: 'name',
            render: name => <span className={`text-cell`}>{name}</span>
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: date => <span className={`text-cell`}>{date}</span>
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: items => <span className={`text-cell`}>{items}</span>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'action',
            width: 80,
            render: (actions, row) => {

                return (
                    <>
                        <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} onClick={actions.showMoreHandler} />
                        <OrderDetailsModal
                            visible={row.key === detailsModal}
                            onHide={setDetailsModal.bind(this, -1)}
                            orderNumber={row.number}
                            date={row.date}
                            cxName={row.name}
                            status={row.status}
                            data={row.data}
                            total={row.total}
                        />
                    </>
                )
            },
            fixed: 'right'
        },
    ];

    const fakeData = useMemo(() => {
        return [...Array(30)].map((item, index) => {
            return {
                key: index + 1,
                index: index + 1,
                number: `ID${123456 + index}`,
                date: '01.01.2020',
                actions: {
                    showMoreHandler: () => setDetailsModal(index + 1),
                },
                name: "Berry wood",
                items: 6,
                data: [...Array(3)].map((item, index) => {
                    return {
                        key: index + 1,
                        index: index + 1,
                        product: 'Choice Beef Brisket Chunk',
                        substitutions: Math.random() > 0.5 ? 'Yes' : 'No',
                        price: '$150.00',
                        tax: '$20.50',
                        store: 'Store name',
                        quantity: 10,
                        total: "$160.00"
                    }
                }),
                total: 240.30
            }
        })
    }, [])

    return (
        <Page title={'Orders'} breadcrumb={[{ title: 'Orders' }]}>
            <Row gutter={24} className={'flex items-center pt-17 pb-10'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'} />
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
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={fakeData} scroll={{ x: 1200 }}/>
                </Col>
            </Row>
        </Page>
    )
}

export default Orders;