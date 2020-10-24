import React, { useMemo } from 'react';
import {Table, Row, Col, Space, Grid, Button} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

import ProfileLayout from "../../../components/Layout/Profile";

const Orders = props => {
    const screens = Grid.useBreakpoint()

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
            render: status => <span className={`text-cell ${status === 'Canceled' && 'text-opacity-50'}`}>{status}</span>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'action',
            width: 140,
            render: row => (
                <Space size={screens.lg ? 60 : screens.md ? 40 : screens.sm ? 24 : 16}>
                    <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} onClick={row.showMoreHandler} />
                    <Button type={'link'} className={'underline text-base font-medium'} onClick={row.deleteHandler}>{row.dangerText}</Button>
                </Space>
            ),
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
                    showMoreHandler: () => alert('show more'),
                    deleteHandler: () => alert('deleted')
                }
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
        </ProfileLayout>
    )
}

export default Orders;