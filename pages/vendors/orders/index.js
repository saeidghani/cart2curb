import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Button, Col, Form, Input, message, Row, Table} from "antd";

import Page from "../../../components/Page";
import {FileSearchOutlined} from "@ant-design/icons";
import OrderDetailsModal from "../../../components/Modals/OrderDetails";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../components/UI/Loader";
import withAuth from "../../../components/hoc/withAuth";
import moment from "moment";

const { Item } = Form;

const Orders = props => {
    const [form] = Form.useForm();
    const [detailsModal, setDetailsModal] = useState(-1);
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.vendorStore.getOrders);
    const orders = useSelector(state => state.vendorStore.orders.data);

    useEffect(async () => {
        if(hasMore) {
            let body = {
                page_number: page,
            }

            try {
                const response = await dispatch.vendorStore.getOrders(body)
                if(response.data.length < 30) {
                    setHasMore(false);
                }
            } catch(e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
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
        if (target.isIntersecting) {
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
            width: 96,
            render: (actions, row) => {

                return (
                    <>
                        <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} onClick={actions.showMoreHandler} className={'btn-icon-small'} />
                        <OrderDetailsModal
                            visible={row.key === detailsModal}
                            onHide={setDetailsModal.bind(this, -1)}
                            orderNumber={row.number}
                            date={row.date}
                            cxName={row.name}
                            status={row.status}
                            data={row.data}
                            total={row.totalPrice}
                        />
                    </>
                )
            },
        },
    ];


    const data = useMemo(() => {
        return orders && orders.map((order, index) => {
            return {
                key: order._id,
                index: order._id,
                number: order.orderNumber || order._id,
                date: moment(order.date).format('YYYY-MM-DD'),
                totalPrice: order.products.reduce((total, item) => total += item.totalPrice, 0),
                items: order.products.length,
                status: order.status,
                actions: {
                    showMoreHandler: () => setDetailsModal(order._id),
                },
                name: order.customer ? `${order.customer.fname} ${order.customer.lname}` : '-',
                data: order.products.map((item, index) => {
                    return {
                        key: item._id,
                        index: item._id,
                        product: item.name,
                        subtitution: item.subtitution ? 'Yes' : 'No',
                        price: `$${item.price}`,
                        tax: `$${item.tax}`,
                        store: item.store,
                        quantity: item.quantity,
                        total: `$${item.totalPrice}`
                    }
                }),
            }
        })
    }, [orders, loading])

    return (
        <Page title={'Orders'} breadcrumb={[{ title: 'Orders' }]}>
            <Row gutter={24} className={'flex items-center pt-2 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'} />
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1100 }}
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
        </Page>
    )
}

export default withAuth(Orders, 'vendor');