import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {
    FileSearchOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";

import routes from "../../constants/routes";
import deleteModal from "../../components/Modals/Delete";
import OrderDetailsModal from "../../components/Modals/OrderDetails";
import Loader from "../../components/UI/Loader";
import {getProperty} from "../../helpers";

const { Item } = Form;
const { Option } = Select;

let isIntersecting = true;
const admin = ({vendor, ...props}) => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const categoryLoading = useSelector(state => state?.loading?.effects?.admintore?.getCategories);
    const productsLoading = useSelector(state => state?.loading?.effects?.admintore?.getProducts);
    const products = useSelector(state => state?.admintore?.products?.data);

    /* useEffect(async () => {
         if(hasMore || page === 1) {
             const formFields = form.getFieldsValue()
             let body = {
                 page_number: page,
                 page_size: 15,
             }
             if(formFields.search) {
                 body.search = formFields.search;
             }
             if(formFields.category && formFields.category !== 'all') {
                 body.category = formFields.category;
             }
             try {
                 const response = await dispatch.admintore.getProducts(body)
                 if(response.data.length < 15) {
                     setHasMore(false);
                 }
             } catch(e) {
                 console.log(e);
                 setHasMore(false);
                 message.error('An Error was occurred while fetching data')
             }
         }
         isIntersecting = true;
     }, [page, selectedCategory, search])


     useEffect(() => {
         dispatch.admintore.getCategories()
             .then(response => {
                 if(response)
                     setCategories(response.data);
             })
     }, [])


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

     }, [loader.current]);*/

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
            title: "CX Name",
            dataIndex: 'CXName',
            key: 'CXName',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Date",
            dataIndex: 'date',
            key: 'date',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Items",
            dataIndex: 'items',
            key: 'items',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Action",
            dataIndex: 'action',
            key: 'action',
            render: (actions, row) => {
                return (
                    <div className={'flex flex-row items-center'}>
                        <Button type={'link'} shape={'circle'} icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} className={'btn-icon-small'} onClick={actions.deleteHandler} />
                    </div>
                )
            },
            width: 140,
        },
    ]

    const data = useMemo(() => {
        return products && products.filter(item => !deleted.includes(item._id)).map((product, index) => {
            const category = categories.find(cat => cat._id === product.category)
            return {
                key: '1',
                CXName: 'aaa',
                date: 'aaa',
                items: 'aaa',
                action: {
                    deleteHandler: () => {
                        OrderDetailsModal({
                            onOk: async () => {
                                const res = await dispatch.admintore.deleteProduct(product._id);
                                if(res) {
                                    setDeleted(deleted.concat(product._id))
                                }
                            },
                            okText: 'Ok',
                            title: 'Do you want to delete this product?',
                            content: 'Are you sure to delete this product? There is no going back!!',
                        });
                    },
                },
            }
        })
    }, [products, categories, deleted])

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
                            <Col lg={6} xs={24}>
                                <Item className={'pt-7'}>
                                    <Button type={'primary'} size={'lg'} className={'w-32'} htmlType={'submit'} loading={productsLoading}>Search</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={6} xs={24} className={'flex flex-row-reverse'}>
                    <Link href={routes.admin.products.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{ fontSize: 20 }}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                            //disabled={categories.length === 0}
                        >
                            Add New Vendor
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>

                    <Table columns={columns} dataSource={data} scroll={{ x: 1100 }} pagination={false} loading={productsLoading && products.length === 0}/>
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

export default admin;