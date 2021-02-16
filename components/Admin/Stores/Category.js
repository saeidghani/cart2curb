import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import routes from "../../../constants/routes";
import Link from "next/link";
import deleteModal from "../../Modals/Delete";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../UI/Loader";
import store from "../../../states";
import {useRouter} from "next/router";

const {Item} = Form;
const {Option} = Select;

let isIntersecting = true;
const Categories = props => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [parentCategory, setParentCategory] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const categoryLoading = useSelector(state => state.loading.effects.adminStore.getCategories);
    const categories = useSelector(state => state.adminStore.categories.data);
    const token = store?.getState()?.adminAuth?.token;
    const router = useRouter();
    const {storeId, storeType} = router.query;

    useEffect(() => {
        if (storeId && token) {
            dispatch.adminStore.getCategories({storeId, query: {}, token})
                .then(response => {
                    if (response)
                        setParentCategory(response.data);
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
            if (formFields.parent_category && formFields.parent_category !== 'all') {
                query.parent_category = formFields.parent_category;
            }
            if (storeId && token) {
                try {
                    const response = await dispatch.adminStore.getCategories({storeId, query, token})
                    if (response.data.length < 15) {
                        setHasMore(false);
                    }
                } catch (e) {
                    setHasMore(false);
                    console.log(e);
                    message.error('An Error was occurred while fetching data')
                }
            }
        }
        isIntersecting = true;
    }, [page, selectedCategory, storeId, search, token]);

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
        setSelectedCategory(values.parent_category);
    }


    const columns = [
        {
            title: "Title",
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Parents",
            dataIndex: 'parents',
            key: 'parents',
            width: 200,
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Desc",
            dataIndex: 'description',
            key: 'description',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "",
            dataIndex: 'actions',
            key: 'actions',
            render: (actions, row) => {
                return (
                    <div className={'flex flex-row items-center'}>
                        <Link href={{pathname: routes.admin.categories.edit(row.key), query: {storeId, storeType}}}>
                            <Button type={'link'} shape={'circle'}
                                    icon={<EditOutlined className={'text-secondarey text-xl'}/>}
                                    className={'btn-icon-small mr-4'}/>
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'}/>}
                                onClick={actions.deleteHandler} className={'btn-icon-small'}/>
                    </div>
                )
            },
            width: 140,
            fixed: 'right',
        },
    ];

    const data = useMemo(() => {
        return categories.filter(item => !deleted.includes(item._id)).map((item, index) => {
            return {
                key: item?._id,
                index: item?._id,
                title: item?.name,
                number: '1111',
                description: item?.description,
                parents: item?.parent?.name || '-',
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: async () => {
                                const res = await dispatch?.adminStore?.deleteCategory({storeId, categoryId: item?._id, token});
                                if (res) {
                                    setDeleted(deleted?.concat(item?._id))
                                }
                            },
                            okText: 'OK',
                            title: 'Do you want to delete this Category?',
                            content: 'Are you sure to delete this category? There is no going back!!',
                        });
                    },
                },
            }
        })
    }, [categories, page, deleted]);

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
                                <Item name={'parent_category'} label={'Parent Category'}>
                                    <Select
                                        allowClear
                                        placeholder={'Parent Category'}
                                        loading={categoryLoading}
                                    >
                                        {parentCategory && (
                                            <>
                                                <Option value={'all'}>All</Option>
                                                {parentCategory.map(cat => {
                                                    return (
                                                        <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'} loading={categoryLoading}
                                            htmlType={'submit'}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={{pathname: routes.admin.categories.add, query: {...router.query, storeId}}}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{fontSize: 20}}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                        >
                            Add New Category
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={data} pagination={false} scroll={{x: 990}} locale={{
                        emptyText: 'There is no Category'
                    }} loading={categoryLoading && categories.length === 0}/>

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

export default Categories;