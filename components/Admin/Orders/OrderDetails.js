import React, {Fragment, useEffect, useMemo} from 'react';
import {Table, Modal, Row, Col} from 'antd';
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

    const productData = useMemo(() => {
        return (order?.products || [])?.map((p, index) => {
            return {
                key: p?._id,
                index: index + 1,
                product: p?.name,
                store: getAddress(p?.store?.address),
                subtitution: p?.subtitution ? 'Yes' : 'No',
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
                subtitution: p?.subtitution ? 'Yes' : 'No',
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
            <div className={`grid grid-cols-${type === 'productCart' ? '4' : '6'}`}>
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
                    title={'Status'}
                    labelColor={'muted'}
                    valueColor={'dark'}
                    capitalize={true}
                    value={order?.status}
                />
            </div>
            <Table
                columns={type === 'productCart' ? productColumns : type === 'serviceCart' ? serviceColumns : customColumns}
                dataSource={type === 'productCart' ? productData : type === 'serviceCart' ? serviceData : customData}
                pagination={false}
                className={'pt-4'}
                scroll={{x: 950}}
            />
            <div className='flex justify-end items-center p-4 mt-4'>
                <div className="flex items-center justify-end pr-3">
                    <span className="text-cell text-xl">{order?.priceAfterPromoTip ? `${order?.priceAfterPromoTip} $` : '_'}</span>
                </div>
            </div>
        </Modal>
    )
}

export default OrderDetails;
