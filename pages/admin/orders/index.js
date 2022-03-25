import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Button, Col, Form, Input, message, Row, Table} from "antd";
import {FileSearchOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";

import Page from "../../../components/Page";
import AdminAuth from "../../../components/Admin/AdminAuth";
import OrderDetailsModal from "../../../components/Admin/Orders/OrderDetails";
import Loader from "../../../components/UI/Loader";
import routes from "../../../constants/routes";

const {Item} = Form;

let isIntersecting = true;
const Orders = props => {
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const [detailsModal, setDetailsModal] = useState(-1);
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const loading = useSelector(state => state?.loading?.effects?.adminStore?.getOrders);
    const orders = useSelector(state => state?.adminStore?.orders?.data);
    const order = useSelector(state => state?.adminStore?.order);
    const isLoggedIn = useSelector(state => state?.adminAuth?.isLoggedIn);
    const token = useSelector(state => state?.adminAuth?.token);

    useEffect(async () => {
        if (hasMore || page === 1) {
            const formFields = form.getFieldsValue()
            let query = {
                page_number: page,
                sort: '-date'
            }

            if (formFields.search) {
                query.search = formFields.search;
            }

            if (isLoggedIn) {
                try {
                    const response = await dispatch.adminStore.getOrders(query);
                    if (response.data.length < 30) {
                        setHasMore(false);
                    }
                } catch (e) {
                    setHasMore(false);
                    message.error('An Error was occurred while fetching data')
                }
            }
        }
        isIntersecting = true;
    }, [page, search]);

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

    const searchHandler = (values) => {
        isIntersecting = false;
        setPage(1);
        setHasMore(true);
        setSearch(values.search);
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
            render: number => <span className={`text-cell`}>ID{number}</span>
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
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            render: type => <span className={`text-cell`}>
                {type === 'productCart' ? 'product cart' : type === 'serviceCart' ? 'service cart' : 'custom cart'}
            </span>
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            key: 'action',
            width: 96,
            render: (actions, row) => {
                return (
                    <>
                        <Button type={'link'} shape="circle"
                                icon={<FileSearchOutlined className={'text-secondarey text-xl'}/>}
                                onClick={actions.showMoreHandler} className={'btn-icon-small'}/>
                        <OrderDetailsModal
                            visible={row.key === detailsModal}
                            onHide={setDetailsModal.bind(this, -1)}
                            orderNumber={row.number}
                            orderId={row.key}
                            status={row.status}
                            total={row.totalPrice}
                            type={row.type}
                        />
                    </>
                )
            },
        },
    ];

    const data = useMemo(() => {
        return orders && orders?.map((order, index) => {
            return {
                key: order?._id,
                number: order?.orderNumber || order?._id,
                index: order?._id,
                date: moment(order?.date)?.format('MM.DD.YYYY HH:mm A'),
                type: order?.type,
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
    }, [orders, loading])

    const breadcrumb = [
        {
            title: 'Order',
            href: routes.admin.orders.index,
        }
    ]

    return (
        <AdminAuth>
            <Page title={'Orders'} breadcrumb={breadcrumb}>
                <div style={{minHeight: 300}}>
                    <Row gutter={24} className={'flex items-center pt-2 pb-4'}>
                        <Col lg={18} xs={24}>
                            <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                                <Row gutter={24}>
                                    <Col lg={9} xs={24}>
                                        <Item name={'search'} label={'Search'}>
                                            <Input placeholder={'Search'} allowClear/>
                                        </Item>
                                    </Col>
                                    <Col lg={6} xs={24}>
                                        <Item className={'pt-7'}>
                                            <Button type={'primary'} size={'lg'} className={'w-32'}
                                                    htmlType={'submit'}>Search</Button>
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
                                scroll={{x: 1100}}
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
                </div>
            </Page>
        </AdminAuth>
    )
}

export default Orders;
