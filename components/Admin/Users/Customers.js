import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, message} from 'antd';
import {
    PlusCircleOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EditOutlined,
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import routes from "../../../constants/routes";
import Loader from "../../UI/Loader";
import Avatar from "../../UI/Avatar";

const {Item} = Form;
const {Option} = Select;

let isIntersecting = true;
const Customers = () => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [blocked, setBlocked] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const customersLoading = useSelector(state => state?.loading?.effects?.adminUser?.getCustomers);
    const customers = useSelector(state => state?.adminUser?.customers?.data);
    const token = useSelector(state => state?.adminAuth?.token);

    useEffect(async () => {
        if (hasMore || page === 1) {
            const formFields = form.getFieldsValue()
            let query = {
                page_number: page,
                page_size: 15,
            }
            if (formFields.search) {
                query.search = formFields.search;
            }
            try {
                const response = await dispatch.adminUser?.getCustomers(query);
                if (response.data.length < 15) {
                    setHasMore(false);
                }
            } catch (e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
        isIntersecting = true;
    }, [page, search]);

    useEffect(() => {
        let isBlocked = [];
        customers?.forEach(c => {
            if (c?.isBlocked) isBlocked.push(c?._id);
        });
        setBlocked(isBlocked);
    }, [customers]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }

    }, [loader.current]);

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

    const columns = useMemo(() => [
        {
            title: "",
            dataIndex: 'avatar',
            key: 'avatar',
            render: src => <Avatar src={src} justImage/>
        },
        {
            title: "#",
            dataIndex: 'number',
            key: 'number',
            render: number => <span className="text-cell">{number}</span>
        },
        {
            title: "Customer Name",
            dataIndex: 'CXName',
            key: 'CXName',
            render: CXName => <span className="text-cell">{CXName}</span>
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
            render: email => <span className="text-cell">{email}</span>
        },
        {
            title: "Phone Number",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: phoneNumber => <span className="text-cell">{phoneNumber}</span>
        },
        {
            title: "Address",
            dataIndex: 'address',
            key: 'address',
            render: address => <span className="text-cell">{address}</span>
        },
        {
            title: "OP",
            dataIndex: 'action',
            key: 'action',
            render: (actions, {key}) => {
                return (
                    <div className={'flex flex-row items-center space-x-3'}>
                        <Link href={{pathname: routes.admin.customers.edit(key)}}>
                            <Button
                                type={'link'}
                                shape={'circle'}
                                icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                className={'btn-icon-small'}
                            />
                        </Link>
                        {(blocked?.includes(key)) ? <Button
                            type={'link'}
                            shape={'circle'}
                            icon={<CheckCircleOutlined className='text-secondarey text-xl'/>}
                            className={'btn-icon-small'}
                            onClick={actions.unBlockHandler}
                        /> : <Button
                            type={'link'}
                            shape={'circle'}
                            icon={<StopOutlined className='text-secondarey text-xl'/>}
                            className={'btn-icon-small'}
                            onClick={actions.blockHandler}
                        />}
                    </div>
                )
            },
            width: 140,
        },
    ], [blocked]);

    const setSubstring = (str, lastIndex) => {
        return `${str.substring(0, lastIndex)} ...`;
    }

    const data = useMemo(() => {
        return customers?.map((customer, index) => ({
                key: customer?._id,
                avatar: customer?.image,
                CXName: `${customer?.firstName} ${customer?.lastName}`,
                number: customer?._id,
                email: customer?.email  || '-',
                phoneNumber: customer?.phone || '-',
                address: (customer?.addresses?.length > 0 && customer?.addresses[0] !== null) ?
                 setSubstring(`${customer?.addresses[0]?.addressLine1 || ''} ${customer?.addresses[0]?.city || ''} ${customer?.addresses[0]?.state || ''} ${customer?.addresses[0]?.country || ''} ${customer?.addresses[0]?.postalCode || ''}`, 20) :
                    '-',
                action: {
                    blockHandler: async () => {
                        const res = await dispatch.adminUser.editCustomerBlock({customerId: customer?._id, token});
                        if (res) {
                            setBlocked(blocked.concat(customer?._id));
                        }
                    },
                    unBlockHandler: async () => {
                        const res = await dispatch.adminUser.editCustomerUnBlock({customerId: customer?._id, token});
                        if (res) {
                            const newBlocked = blocked?.filter(b => b !== customer?._id);
                            setBlocked(newBlocked);
                        }
                    },
                },
            })
        );
    }, [customers]);

    return (
        <>
            <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'}/>
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'}
                                            loading={customersLoading}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={routes.admin.customers.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                            disabled={customers?.length === 0}
                        >
                            Add New Customer
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>

                    <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                           loading={customersLoading && customers?.length === 0}/>
                    {hasMore && (
                        <div ref={loader}>

                            <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default Customers;