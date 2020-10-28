import React, { useMemo, useState } from 'react';
import {Table, Row, Col, Space, Grid, Button, Modal, Checkbox, InputNumber} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

import ProfileLayout from "../../../components/Layout/Profile";
import ReportModal from "../../../components/Modals/Report";
import deleteOrderModal from '../../../components/Modals/DeleteOrder';
import OrderDetailsModal from "../../../components/Modals/OrderDetails";
import withAuth from "../../../components/hoc/withAuth";

const Orders = props => {
    const screens = Grid.useBreakpoint()
    const [reportModalShow, setReportModalShow] = useState(false);
    const [detailsModal, setDetailsModal] = useState(-1);

    const columns = [
        {
            title: '# Order Number',
            dataIndex: 'number',
            key: 'number',
            render: number => <span className={`text-cell`}>{number}</span>
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: date => <span className={`text-cell`}>{date}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                const classes = ['text-cell'];
                if(status.toLowerCase() === 'canceled') {
                    classes.push('text-opacity-50')
                }

                return (
                    <span className={classes.join(" ")}>{status}</span>
                )
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'action',
            width: 140,
            render: (actions, row) => {

                return (
                    <>
                        <Space size={screens.lg ? 60 : screens.md ? 40 : screens.sm ? 24 : 16}>
                            <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} onClick={actions.showMoreHandler} />
                            <Button type={'link'} className={'underline text-base font-medium'} onClick={actions.deleteHandler}>{actions.dangerText}</Button>
                        </Space>
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
        },
    ];

    const fakeData = useMemo(() => {
        return [...Array(5)].map((item, index) => {
            const random = Math.random();
            const status = random > 0.6 ? 'In progress' : random > 0.4 ? 'Delivered' : 'Canceled';
            return {
                key: index + 1,
                index: index + 1,
                number: `ID${123456 + index}`,
                date: '01.01.2020',
                status: status,
                actions: {
                    dangerText: random > 0.6 ? 'Delete' : 'Report',
                    showMoreHandler: () => setDetailsModal(index + 1),
                    deleteHandler: () => {
                        if(random <= 0.6) {
                            setReportModalShow(true)
                        } else {
                            deleteOrderModal(() => {
                                console.log(`ID${123456 + index}`)
                            });
                        }
                    },
                },
                name: "Berry wood",
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
        <ProfileLayout title={'Orders'} breadcrumb={[{ title: "User Profile" }]} withoutDivider={true}>
            <Row>
                <Col xs={24}>

                    <Table columns={columns}
                           dataSource={fakeData}
                           pagination={false}
                    />
                </Col>
            </Row>
            <ReportModal
                visible={reportModalShow}
                onOk={setReportModalShow.bind(this, false)}
                onHide={setReportModalShow.bind(this, false)} />
        </ProfileLayout>
    )
}

export default withAuth(Orders);