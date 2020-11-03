import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import routes from "../../constants/routes";
import Link from "next/link";
import deleteModal from "../Modals/Delete";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../UI/Loader";

const { Item } = Form;
const { Option } = Select;

const Categories = props => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [parentCategory, setParentCategory] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const categoryLoading = useSelector(state => state.loading.effects.vendorStore.getCategories);
    const categories = useSelector(state => state.vendorStore.categories.data);


    useEffect(async () => {
        if(hasMore) {
            const formFields = form.getFieldsValue()
            let body = {
                page_number: page,
                page_size: 15,
            }
            if(formFields.search) {
                body.search = formFields.search;
            }
            if(formFields.parent_category && formFields.parent_category !== 'all') {
                body.parent_category = formFields.parent_category;
            }
            try {
                const response = await dispatch.vendorStore.getCategories(body)
                if(response.data.length < 15) {
                    setHasMore(false);
                }
            } catch(e) {
                setHasMore(false);
                console.log(e);
                message.error('An Error was occurred while fetching data')
            }
        }
    }, [page, hasMore])


    useEffect(() => {

        dispatch.vendorStore.getCategories()
            .then(response => {
                if(response)
                    setParentCategory(response.data);
            })
    }, [])


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

    const searchHandler = (values) => {
        setHasMore(true);
        setPage(1);
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
            title: "Description",
            dataIndex: 'description',
            key: 'description',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Action",
            dataIndex: 'actions',
            key: 'actions',
            render: (actions, row) => {
                return (
                    <div className={'flex flex-row items-center'}>
                        <Link href={routes.vendors.categories.edit()} as={routes.vendors.categories.edit(row.title)}>
                            <Button type={'link'} shape={'circle'} icon={<EditOutlined className={'text-secondarey text-xl'} />} className={'btn-icon-small mr-4'} />
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'} />} onClick={actions.deleteHandler} className={'btn-icon-small'} />
                    </div>
                )
            },
            width: 140,
            fixed: 'right',
        },
    ]

    const data = useMemo(() => {
        return categories.filter(item => !deleted.includes(item._id)).map((item, index) => {
            return {
                key: item._id,
                index: item._id,
                title: item.name,
                description: item.description,
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: async () => {
                                const res = await dispatch.vendorStore.deleteCategory(item._id);
                                if(res) {
                                    setDeleted(deleted.concat(item._id))
                                }
                            },
                            okText: 'Ok',
                            title: 'Do you want to delete this Category?',
                            content: 'Are you sure to delete this category? There is no going back!!',
                        });
                    },
                },
            }
        })
    }, [categories, page, deleted])

    return (
        <>
            <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input placeholder={'Search'} />
                                </Item>
                            </Col>
                            <Col lg={9} xs={24}>
                                <Item name={'parent_category'} label={'Parent Category'}>
                                    <Select placeholder={'Parent Category'} loading={categoryLoading}>
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
                                    <Button type={'primary'} size={'lg'} className={'w-32'} loading={categoryLoading} htmlType={'submit'}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={routes.vendors.categories.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{ fontSize: 20 }}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                        >
                            Add New Category
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Table columns={columns} dataSource={data} pagination={false} scroll={{ x: 990 }} locale={{
                        emptyText: 'There is no Category'
                    }} loading={categoryLoading && categories.length === 0}/>

                    <div ref={loader}>
                        {hasMore && (
                            <div className="flex w-full items-center justify-center py-6"><Loader/></div>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Categories;