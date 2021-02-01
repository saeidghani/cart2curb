import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Table, Row, Col, Space, Grid, Button, Modal, Checkbox, InputNumber, Form, message} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

import ProfileLayout from "../../../components/Layout/Profile";
import ReportModal from "../../../components/Modals/Report";
import deleteOrderModal from '../../../components/Modals/DeleteOrder';
import OrderDetailsModal from "../../../components/Modals/OrderDetails";
import withAuth from "../../../components/hoc/withAuth";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../components/UI/Loader";
import moment from "moment";
import {convertAddress} from "../../../helpers";

let isIntersecting = true;
const Orders = props => {
    const screens = Grid.useBreakpoint()
    const [reportModalShow, setReportModalShow] = useState(-1);
    const [orders, setOrders] = useState([]);
    const [deleted, setDeleted] = useState([]);
    const [detailsModal, setDetailsModal] = useState(-1);
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.profile.getOrders);
    const stateOrders = useSelector(state => state.profile.orders.data);

    useEffect(() => {
        setOrders(stateOrders);
    }, [stateOrders]);


    useEffect(async () => {
        if(hasMore || page === 1) {
            let body = {
                page_number: page,
                page_size: 15,
                sort: '-date'
            }
            try {
                const response = await dispatch.profile.getOrders(body)
                if(response.data.length < 15) {
                    setHasMore(false);
                }
            } catch(e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data') // @todo: remove this log
            }
        }
        isIntersecting = true;
    }, [page, hasMore])

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, []);


    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && isIntersecting) {
            isIntersecting = false
            setPage((page) => page + 1)
        }
    }

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
                const classes = ['text-cell', 'capitalize'];
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
                            {row.status.toLowerCase() !== 'canceled' && (
                                <Button type={'link'} className={'underline text-base font-medium'} onClick={actions.deleteHandler}>{actions.dangerText}</Button>
                            )}
                        </Space>
                        <OrderDetailsModal
                            visible={row.key === detailsModal}
                            onHide={setDetailsModal.bind(this, -1)}
                            id={row.id}
                            isCustomer={true}
                        />

                        <ReportModal
                            visible={row.key === reportModalShow}
                            onOk={actions.reportHandler}
                            onHide={setReportModalShow.bind(this, -1)} />
                    </>
                )
            },
        },
    ];

    const data = useMemo(() => {
        return orders && orders.map((order, index) => {
            const status = !deleted.includes(order._id) ? order.status : 'canceled';
            return {
                key: order._id,
                id: order._id,
                number: order.orderNumber || order._id,
                date: moment(order.date).format('MM.DD.YYYY'),
                status: status,
                actions: {
                    dangerText: status.toLowerCase() === 'pending' ? 'Delete' : 'Report',
                    showMoreHandler: () => setDetailsModal(order._id),
                    deleteHandler: () => {
                        if(status.toLowerCase() === 'pending') {
                            deleteOrderModal(async () => {
                                const res = await dispatch.profile.deleteOrder(order._id);
                                if(res) {
                                    setDeleted(deleted.concat(order._id))
                                }
                            });
                        } else {
                            setReportModalShow(order._id)
                        }
                    },
                    reportHandler: async (message) => {
                        const res = await dispatch.profile.reportOrder({
                            id: order._id,
                            body: {
                                message,
                            }
                        })

                        if(res) {
                            setReportModalShow(-1)
                            message.success('Report sent successfully!')
                        }
                    }
                },
            }
        })
    }, [orders, loading, deleted])

    return (
        <ProfileLayout title={'Orders'} breadcrumb={[{ title: "User Profile" }]} withoutDivider={true}>
            <Row>
                <Col xs={24}>

                    <Table columns={columns}
                           dataSource={data}
                           pagination={false}
                           locale={{
                               emptyText: 'You have no Order'
                           }}
                    />
                    <div ref={loader}>
                        {hasMore && (
                            <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                        )}
                    </div>
                </Col>
            </Row>
        </ProfileLayout>
    )
}

export default withAuth(Orders, 'customer');