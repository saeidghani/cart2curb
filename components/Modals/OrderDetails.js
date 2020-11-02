import React from 'react';
import {Table, Modal, Row, Col} from 'antd';

import DetailItem from "../UI/DetailItem";
import Page from "../Page";

const OrderDetailsModal = ({ visible, onHide, data, orderNumber, cxName, date, status, total }) => {

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => (<span className="text-cell">{data}</span>)
        },

        {
            title: 'Store Address',
            dataIndex: 'store',
            key: 'store',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Substitutions',
            dataIndex: 'substitutions',
            key: 'substitutions',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Quantity/Weight',
            dataIndex: 'quantity',
            key: 'quantity',
            render: data => (<span className="text-cell">{data}</span>),
            width: 160
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
            width: 210,
            render: data => (<span className="text-cell">{data}</span>),
            fixed: 'right'
        },
    ];

    return (
        <Modal
            title={'Cart Details'}
            visible={visible}
            onCancel={onHide}
            centered
            width={991}
            footer={null}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Order Number'}
                        value={orderNumber}
                        />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'CX Name'}
                        value={cxName}
                        />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Date'}
                        value={date}
                        />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Status'}
                        value={status}
                        />
                </Col>
                <Col xs={24}>
                    <Table dataSource={data} columns={columns} pagination={false} className={'pt-4'} scroll={{ x: 870 }}/>
                </Col>
                <Col xs={24}>
                    <div className={'flex flex-row-reverse items-start'}>
                        <div className="flex flex-col pl-4" style={{ width: 210 }}>
                            <h1 className="text-left text-4.5xl text-paragraph font-medium mb-2 mt-0">${total}</h1>
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderDetailsModal