import React, {useState, useEffect, useMemo} from 'react';
import {Table, Modal, Row, Col} from 'antd';

import DetailItem from "../UI/DetailItem";
import Page from "../Page";
import {useDispatch} from "react-redux";
import moment from "moment";
import {convertAddress} from "../../helpers";
import Loader from "../UI/Loader";

const OrderDetailsModal = ({ visible, onHide, id, isCustomer }) => { // , data, orderNumber, cxName, date, status, total
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(visible) {
            fetchSingleOrder(id, isCustomer);
        }
    }, [visible, id])

    const fetchSingleOrder = async (id, isCustomer) => {
        setLoading(true);
        try {
            const model = isCustomer ? dispatch.profile : dispatch.vendorStore;
            const res = await model.getSingleOrder(id);

            if(res) {
                setOrder(res);
            }
        } catch(e) {
            setOrder({});
            onHide();
        } finally {
            setLoading(false);
        }
    }

    const columns = [
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
    ];

    if(isCustomer) {
        columns.push({
            title: 'Store Name',
            dataIndex: 'store',
            key: 'store',
            render: data => (<span className="text-cell">{data}</span>)
        })
    }

    columns.push(...[
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
    ])

    const transformedOrder = useMemo(() => {
        if(order && order.hasOwnProperty('_id')) {
            return {
                key: order._id,
                index: order._id,
                number: order.orderNumber || order._id,
                date: moment(order.date).format('MM.DD.YYYY'),
                totalPrice: order.totalPrice,
                deliveryFee: order.deliveryFee,
                serviceFee: order.serviceFee,
                tipPrice: order.tipPrice,
                status: order.status,
                name: `${order?.firstName} ${order?.lastName}`,
                data: order.products?.map((item, i) => {
                    const row = {
                        key: item._id,
                        index: i + 1,
                        product: item.name,
                        subtitution: item.subtitution ? 'Yes' : 'No',
                        price: `$${item.price}`,
                        tax: `$${item.tax}`,
                        quantity: item.quantity,
                        total: `$${item.totalPrice}`
                    }
                    console.log(item);
                    if(isCustomer) {
                        row.store = item?.store?.name
                    }
                    return row;
                }),
            }
        } else {
            return {
                key: '-',
                index: '-',
                number: '-',
                date: '-',
                totalPrice: '-',
                status: '-',
                name: '-',
                data: []
            }
        }

    }, [order]);

    return (
        <Modal
            title={'Cart Details'}
            visible={visible}
            onCancel={onHide}
            centered
            width={1100}
            footer={null}
        >
            {loading ? (
                <div className="flex flex-row items-center justify-center py-10">
                    <Loader/>
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'Order Number'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={transformedOrder.number}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'CX Name'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={transformedOrder.name}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'Date'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={transformedOrder.date}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DetailItem
                            title={'Status'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={transformedOrder.status}
                            capitalize={true}
                        />
                    </Col>
                    <Col xs={24}>
                        <Table dataSource={transformedOrder.data} columns={columns} pagination={false} className={'pt-4'} scroll={{ x: 950 }}/>
                    </Col>
                    <Col span={24}>
                        <div className="flex">
                            <div className="mr-2">Delivery Fee:</div>
                            <div className="">{transformedOrder.deliveryFee}</div>
                        </div>
                        <div className="flex">
                            <div className="mr-2">Service Fee:</div>
                            <div className="">{transformedOrder.serviceFee}</div>
                        </div>
                        <div className="flex">
                            <div className="mr-2">Tip:</div>
                            <div className="">{transformedOrder.tipPrice}</div>
                        </div>
                    </Col>
                    <Col xs={24}>
                        <div className={'flex flex-row-reverse items-center'}>
                            <div className="flex flex-col" style={{ width: 210, paddingLeft: 7}}>
                                <h1 className="text-left text-4.5xl text-cell font-medium mb-2 mt-0">${transformedOrder.totalPrice}</h1>
                            </div>
                            <div className="flex items-center justify-end pr-3">
                                <span className="text-cell">Total Cost</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </Modal>
    )
}

export default OrderDetailsModal
