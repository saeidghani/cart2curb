import React, {Fragment, useEffect, useMemo} from 'react';
import {Table, Modal, Row, Col} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import {useDispatch, useSelector} from "react-redux";

import DetailItem from "../../UI/DetailItem";
import moment from "moment";

const OrderDetails = ({visible, onHide, orderId, status, total, type}) => {
    const dispatch = useDispatch();
    const order = useSelector(state => state?.adminStore?.order);
    const loading = useSelector(state => state?.loading?.effects?.adminStore?.getOrder);
    const token = useSelector(state => state?.adminAuth?.token);

    useEffect(() => {
        if (visible && token && orderId) {
            dispatch?.adminStore?.getOrder({orderId, token});
        }
    }, [token]);

    const getAddress = (destination) => `${destination?.destinationLine1 || ''}${destination?.destinationLine2 || ''} ${destination?.city || ''} ${destination?.province || ''} ${destination?.country || ''}`;

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
            render: (product, data ) => (<span className="text-cell"> <img height="50" sec={data.image} /> {product}</span>)
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
            render: (store, data) => (<span className="text-cell"> {data.storeName} <br /> {store}</span>)
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

    const productData = useMemo(() => {
        return (order?.products || [])?.map((p, index) => {
            return {
                key: p?._id,
                index: index + 1,
                product: p?.name,
                image: p?.image,
                storeName: p?.store?.name,
                store: getAddress(p?.store?.address),
                subtitution: p?.subtitution ? p?.subtitution : 'No',
                quantity: p?.quantity,
                total: p?.totalPrice,
            }
        })
    }, [order, loading]);

    const serviceData = useMemo(() => {
        return (order?.products || [])?.map((p, index) => {
            return {
                key: p?._id,
                index: index + 1,
                service: p?.name,
                description: p?.description || '',
                total: p?.totalPrice,
            }
        })
    }, [order, loading]);

    const customData = useMemo(() => {
        return (order?.products || [])?.map((p, index) => {
            return {
                key: p?._id,
                index: index + 1,
                product: p?.name,
                description: p?.description || '',
                subtitution: p?.subtitution ? p?.subtitution : 'No',
                quantity: p?.quantity,
                total: p?.totalPrice,
            }
        })
    }, [order, loading]);

    return (
        <Modal
            title={'Cart Details'}
            visible={visible}
            onCancel={onHide}
            centered
            width={1100}
            footer={null}
        >
            <div className={`grid grid-cols-${type === 'productCart' ? '4' : '6'} gap-y-2 mb-2`}>
                <DetailItem
                    title={'Order Number'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    value={order?.orderNumber || '-'}
                />
                <DetailItem
                    title={'CX Name'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    value={`${order?.firstName || '-'} ${order?.lastName || '-'}`}
                />
                {order?.guest !== null ?  
                    
                    <>
                        <DetailItem
                            title={'Phone'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={`${order?.guest?.phone}`}
                        />
                        <DetailItem
                            title={'Email'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={`${order?.guest?.email}`}
                        />
                    </>
                    :
                    <>
                        <DetailItem
                            title={'Phone'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={`${order?.customer?.phone}`}
                        />
                        <DetailItem
                            title={'Email'}
                            labelColor={'muted'}
                            valueColor={'dark'}
                            value={`${order?.customer?.email}`}
                        />
                    </>
                }
                {type !== 'productCart' && <Fragment>
                    <DetailItem
                        title={'Email'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={order?.email || '-'}
                    />
                    <DetailItem
                        title={'Address'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        value={order?.address ? getAddress(order?.address) : '-'}
                    />
                </Fragment>}
                <DetailItem
                    title={'Date'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    value={moment(order?.date)?.format('MM.DD.YYYY HH:mm A')}
                />
                <DetailItem
                    title={'Expected Delivery Time'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    value={moment(order?.deliveryTime)?.format('MM.DD.YYYY HH:mm A')}
                />
                <DetailItem
                    title={'Status'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    capitalize={true}
                    value={order?.status}
                />
                <DetailItem
                    title={'Live cart'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    capitalize={true}
                    value={order?.liveCart ? <CheckCircleOutlined className="text-2xl" /> :  <CloseCircleOutlined className="text-2xl" /> }
                />
                <div className="col-span-4">
                    <DetailItem
                        title={'Address'}
                        labelColor={'muted'}
                        valueColor={'dark'}
                        capitalize={true}
                        value={`${order?.address?.postalCode},  - ${order?.address?.addressLine2}, ${order?.address?.addressLine1}, ${order?.address?.city}, ${order?.address?.province}, ${order?.address?.country}`}
                    />
                </div>
            </div>
            

            <Table
                columns={type === 'productCart' ? productColumns : type === 'serviceCart' ? serviceColumns : customColumns}
                dataSource={type === 'productCart' ? productData : type === 'serviceCart' ? serviceData : customData}
                pagination={false}
                className={'pt-4'}
                scroll={{x: 950}}
            />

            <div className="border rounded h-16 p-3 overflow-auto my-4" style={{borderColor : "#00000030"}}>
                Delivery notes: {order?.note}
            </div>

            <div className={`grid grid-cols-6`}>

                <div className="">
                    <div class="text-muted font-medium mb-1">Payment Type:</div>
                    <span className="text-cell text-lg">{order?.paymentMethod}</span>
                </div>
                <div className="">
                    <div class="text-muted font-medium mb-1">Total product cost:</div>
                    <span className="text-cell text-lg">{order?.cartPrice ? `${order?.cartPrice} $` : '_'}</span>
                </div>
                <div className="">
                    <div class="text-muted font-medium mb-1">Service fee:</div>
                    <span className="text-cell text-lg">{order?.serviceFee ? `${order?.serviceFee} $` : '_'}</span>
                </div>
                <div className="">
                    <div class="text-muted font-medium mb-1">Tax:</div>
                    <span className="text-cell text-lg">{order?.hst ? `${order?.hst} $` : '_'}</span>
                </div>
                <div className="">
                    <div class="text-muted font-medium mb-1">Tip:</div>
                    <span className="text-cell text-lg">{order?.tipPrice ? `${order?.tipPrice} $` : '_'}</span>
                </div>
                <div className="">
                    <div class="text-muted font-medium mb-1">Delivery fee:</div>
                    <span className="text-cell text-xl">{order?.priceAfterPromoTip ? `${order?.priceAfterPromoTip} $` : '_'}</span>
                </div>
            </div>
        </Modal>
    )
}

export default OrderDetails;
