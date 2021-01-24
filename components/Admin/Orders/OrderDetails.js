import React, {Fragment, useEffect, useMemo} from 'react';
import {Table, Modal, Row, Col} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import DetailItem from "../UI/DetailItem";
import moment from "moment";

const OrderModal = ({visible, onHide, data, status, total, type}) => {
    const dispatch = useDispatch();
    const order = useSelector(state => state?.adminStore?.order);
    const loading = useSelector(state => state?.loading?.effects?.adminStore?.getOrder);

    useEffect(() => {
        dispatch?.adminStore?.getOrder();
    }, []);

  /*  const data = useMemo(() => {
        return orders && orders?.map((order, index) => {
            return {
                key: order?._id,
                number: order?.orderNumber || order?._id,
                index: order?._id,
                date: moment(order?.date)?.format('MM.DD.YYYY'),
                totalPrice: order?.products?.reduce((total, item) => total += item?.totalPrice, 0)?.toFixed(2),
                items: order?.items || order?.products?.reduce((initial, item) => initial += item?.quantity, 0) || order?.products?.length,
                status: order?.status,
                actions: {
                    showMoreHandler: async () => {
                        await dispatch?.adminStore?.getOrder({orderId: order?._id, token});
                        setDetailsModal(order?._id);
                    }
                },
                name: order?.cxName || '-',
                data: order?.products?.map((item, i) => {
                    return {
                        key: item?._id,
                        index: i + 1,
                        product: item?.name,
                        subtitution: item?.subtitution ? 'Yes' : 'No',
                        price: `$${item?.price}`,
                        tax: `$${item?.tax}`,
                        quantity: item?.quantity,
                        total: `$${item?.totalPrice}`
                    }
                }),
            }
        })
    }, [orders, loading]);*/

    const productColumns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => (<span className="text-cell">{data}</span>),
            width: 60
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
            dataIndex: 'subtitution',
            key: 'subtitution',
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

    const serviceColumns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => (<span className="text-cell">{data}</span>),
            width: 60
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: data => (<span className="text-cell">{data}</span>)
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

    const customColumns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => (<span className="text-cell">{data}</span>),
            width: 60
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: data => (<span className="text-cell">{data}</span>)
        },
        {
            title: 'Substitutions',
            dataIndex: 'subtitution',
            key: 'subtitution',
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
            width={1100}
            footer={null}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Order Number'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={order?.orderNumber}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'CX Name'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={order?.cxName}
                    />
                </Col>
                {type !== 'product' && <Fragment>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'Email'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={order?.email}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'Address'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={order?.address}
                        />
                    </Col>
                </Fragment>}
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Date'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={order?.date}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <DetailItem
                        title={'Status'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={status}
                        capitalize={true}
                    />
                </Col>
                <Col xs={24}>
                    <Table dataSource={data} columns={columns} pagination={false} className={'pt-4'} scroll={{x: 950}}/>
                </Col>
                <Col xs={24}>
                    <div className={'flex flex-row-reverse items-center'}>
                        <div className="flex flex-col" style={{width: 210, paddingLeft: 7}}>
                            <h1 className="text-left text-4.5xl text-cell font-medium mb-2 mt-0">${total}</h1>
                        </div>
                        <div className="flex items-center justify-end pr-3">
                            <span className="text-cell">Delivery Cost + Extra</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderModal;