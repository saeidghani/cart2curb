import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, message} from 'antd';
import {
    FileSearchOutlined,
    EditOutlined, PlusCircleOutlined,
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import routes from "../../../constants/routes";
import Loader from "../../../components/UI/Loader";
import AdminAuth from "../../../components/Admin/AdminAuth";
import Page from "../../../components/Page";

const {Item} = Form;
const {Option} = Select;

let isIntersecting = true;
const Stores = ({admin, ...props}) => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const storesLoading = useSelector(state => state.loading.effects.adminStore.getStores);
    const stores = useSelector(state => state.adminStore.stores?.data);

    useEffect(async () => {
        if (hasMore || page === 1) {
            const formFields = form.getFieldsValue()
            let body = {
                page_number: page,
                page_size: 15,
            }
            if (formFields.search) {
                body.search = formFields.search;
            }
            try {
                const response = await dispatch.adminStore.getStores(body)
                if (response.data.length < 15) {
                    setHasMore(false);
                }
            } catch (e) {
                console.log(e);
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
        isIntersecting = true;
    }, [page, selectedCategory, search])


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
        setSelectedCategory(values.category);
    }

    const columns = [
        {
            title: "#",
            dataIndex: 'number',
            key: 'number',
            render: number => <span className="text-cell">{number}</span>
        },
        {
            title: "Name",
            dataIndex: 'CXName',
            key: 'CXName',
            render: CXName => <span className="text-cell">{CXName}</span>
        },
        {
            title: "Store",
            dataIndex: 'store',
            key: 'store',
            render: store => <span className="text-cell">{store}</span>
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
            render: (_, {storeId, vendorId, storeType}) => {
                return (
                    <div className={'flex flex-row items-center space-x-2'}>
                        <Link
                            href={{
                                pathname: routes.admin.stores.storeDetails,
                                query: {storeId, storeType}
                            }}
                        >
                            <Button
                                type={'link'}
                                shape={'circle'}
                                icon={<FileSearchOutlined className={'text-secondarey text-xl'}/>}
                                className={'btn-icon-small'}
                            />
                        </Link>
                        <Link
                            href={{
                                pathname: routes.admin.vendors.edit(vendorId), query: {storeId, editType: 'store'}
                            }}
                        >
                            <Button
                                type={'link'}
                                shape={'circle'}
                                icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                className={'btn-icon-small'}
                            />
                        </Link>
                    </div>
                )
            },
            width: 140,
        },
    ]

    const data = useMemo(() => {
        return stores?.map((el, index) => {
            return {
                key: index,
                storeId: el?.store?._id,
                vendorId: el?.vendor?._id,
                storeType: el?.store?.storeType,
                number: el?.store?.storeNumber || '-',
                CXName: el?.vendor?.contactName,
                store: el?.store?.name,
                address: `${el?.store?.address?.addressLine1}
                ${el?.store?.address?.addressLine2}
                ${el?.store?.address?.city}
                ${el?.store?.address?.province}
                ${el?.store?.address?.country}
                ${el?.store?.address?.postalCode}`
            }
        })
    }, [stores]);

    const breadcrumb = [
        {
            title: 'Stores',
        }
    ];

    return (
        <AdminAuth>
            <Page title={false} headTitle={'Deliveries'} breadcrumb={breadcrumb}>
                <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
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
                                        <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'}
                                                loading={storesLoading}>
                                            Search
                                        </Button>
                                    </Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                        <Link href={{pathname: routes.admin.stores.add}}>
                            <Button
                                type={'link'}
                                icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
                                className={'flex items-center justify-center px-0 text-info hover:text-teal-500 text-base'}
                            >
                                Add New Store
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>

                        <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                               loading={storesLoading && stores.length === 0}/>
                        {hasMore && (
                            <div ref={loader}>

                                <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Page>
        </AdminAuth>
    )
}

export default Stores;
