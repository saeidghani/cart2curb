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
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },

        {
            title: 'Store Address',
            dataIndex: 'store',
            key: 'store',
        },
        {
            title: 'Substitutions',
            dataIndex: 'substitutions',
            key: 'substitutions',
        },
        {
            title: 'Quantity/Weight',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 160
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
            width: 210
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
                    <Table dataSource={data} columns={columns} pagination={false} className={'pt-4'}/>
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