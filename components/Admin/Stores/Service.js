import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {
    FileSearchOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import routes from "../../../constants/routes";
import Link from "next/link";
import deleteModal from "../../Modals/Delete";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../UI/Loader";
import {useRouter} from "next/router";
import store from '../../../states';

const {Item} = Form;
const {Option} = Select;

let isIntersecting = true;
const Services = ({vendor, ...props}) => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const categoryLoading = useSelector(state => state?.loading?.effects?.adminStore?.getCategories);
    const servicesLoading = useSelector(state => state?.loading?.effects?.adminStore?.getServices);
    const services = useSelector(state => state?.adminStore?.services?.data);
    const token = store?.getState()?.adminAuth?.token;
    const router = useRouter();
    const {storeId, storeType} = router.query;

    useEffect(() => {
        if (storeId && token) {
            dispatch.adminStore.getCategories({storeId, query: {}, token})
                .then(response => {
                    if (response)
                        setCategories(response.data);
                })
        }
    }, [storeId, token]);

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
            if (formFields.category && formFields.category !== 'all') {
                query.category = formFields.category;
            }
            if (token) {
                try {
                    const response = await dispatch.adminStore.getServices({storeId, query, token});
                    if (response.data.length < 15) {
                        setHasMore(false);
                    }
                } catch (e) {
                    console.log(e);
                    setHasMore(false);
                    message.error('An Error was occurred while fetching data')
                }
            }
        }
        isIntersecting = true;
    }, [page, selectedCategory, search, storeId, token]);

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
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Name",
            dataIndex: 'name',
            key: 'name',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Cost Price",
            dataIndex: 'price',
            key: 'price',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Tax Rate",
            dataIndex: 'tax',
            key: 'tax',
            width: 143,
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Parent Category",
            dataIndex: 'category',
            key: 'category',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Action",
            dataIndex: 'actions',
            key: 'actions',
            render: (actions, row) => {
                return (
                    <div className={'flex flex-row items-center'}>
                        {/*as={routes.admin.services.view(row.number)}*/}
                        <Link href={{pathname: routes.admin.services.view(row.key), query: {storeId, storeType}}}>
                            <Button type={'link'} shape="circle"
                                    icon={<FileSearchOutlined className={'text-secondarey text-xl'}/>}
                                    className={'btn-icon-small mr-4'}/>
                        </Link>
                        <Link href={{pathname: routes.admin.services.edit(row.key), query: {storeId, storeType}}}>
                            <Button type={'link'} shape={'circle'}
                                    icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                    className={'btn-icon-small mr-4'}/>
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'}/>}
                                className={'btn-icon-small'} onClick={actions.deleteHandler}/>
                    </div>
                )
            },
            width: 140,
        },
    ]

    const data = useMemo(() => {
        return services?.filter(item => !deleted.includes(item._id)).map((service, index) => {
            const category = categories.find(cat => cat._id === service.category?._id)
            return {
                key: service?._id,
                index: service?._id,
                number: '11111',
                name: service?.name,
                price: `$${service?.priceList?.cost}`,
                tax: `${service?.tax}%`,
                category: category ? category?.name : service?.category?.name,
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: async () => {
                                const res = await dispatch?.adminStore?.deleteService({storeId, serviceId: service?._id, token});
                                if (res) {
                                    setDeleted(deleted?.concat(service?._id))
                                }
                            },
                            okText: 'OK',
                            title: 'Do you want to delete this service?',
                            content: 'Are you sure to delete this service? There is no going back!!',
                        });
                    },
                },
            }
        })
    }, [services, categories, deleted]);

    return (
        <>
            <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'} allowClear/>
                                </Item>
                            </Col>
                            <Col lg={9} xs={24}>
                                <Item name={'category'} label={'Category'}>
                                    <Select placeholder={'Category'} loading={categoryLoading} allowClear>
                                        <Option value={'all'}>All</Option>
                                        {(categories || [])?.map(cat => {
                                            return (
                                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'}
                                            loading={servicesLoading}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={{pathname: routes.admin.services.add, query: {storeId, storeType}}}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-secondarey mr-3'} style={{fontSize: 20}}/>}
                            className={'flex items-center justify-center px-0 text-secondarey hover:text-teal-500 text-base'}
                            //disabled={categories.length === 0}
                        >
                            Add New Service
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={data} scroll={{x: 1100}} pagination={false}
                           loading={servicesLoading && services.length === 0}/>
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

export default Services;