import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Row, Col, Input, Form, Table, Select, Button, Space, message} from 'antd';
import {
    FileSearchOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import routes from "../../constants/routes";
import Link from "next/link";
import deleteModal from "../Modals/Delete";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../UI/Loader";
import {getProperty} from "../../helpers";

const { Item } = Form;
const { Option } = Select;

const Products = ({vendor, ...props}) => {
    const loader = useRef(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [deleted, setDeleted] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const categoryLoading = useSelector(state => state.loading.effects.vendorStore.getCategories);
    const productsLoading = useSelector(state => state.loading.effects.vendorStore.getProducts);
    const products = useSelector(state => state.vendorStore.products.data);

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
            if(formFields.category) {
                body.category = formFields.category;
            }
            try {
                const response = await dispatch.vendorStore.getProducts(body)
                if(response.data.length < 15) {
                    setHasMore(false);
                }
            } catch(e) {
                console.log(e);
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
    }, [page, hasMore])


    useEffect(() => {
        dispatch.vendorStore.getCategories()
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

    }, [loader.current]);

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
            title: "Unit/Weight Price",
            dataIndex: 'unitPrice',
            key: 'unitPrice',
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
            title: "Stock",
            dataIndex: 'stock',
            key: 'stock',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: "Categories",
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
                        <Link href={routes.vendors.products.view()} as={routes.vendors.products.view(row.number)}>
                            <Button type={'link'} shape="circle" icon={<FileSearchOutlined  className={'text-secondarey text-xl'}/>} className={'btn-icon-small mr-4'} />
                        </Link>
                        <Link href={routes.vendors.products.edit()} as={routes.vendors.products.edit(row.number)}>
                            <Button type={'link'} shape={'circle'} icon={<EditOutlined className={'text-secondarey text-xl'} />} className={'btn-icon-small mr-4'} />
                        </Link>
                        <Button type={'link'} shape={'circle'} icon={<DeleteOutlined className={'text-btn text-xl'} />} className={'btn-icon-small'} onClick={actions.deleteHandler} />
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
                key: product._id,
                index: product._id,
                number: product._id,
                name: product.name,
                unitPrice: `$${product.priceList.price}`,
                price: `$${product.priceList.cost}`,
                tax: `${product.tax}%`,
                stock: `$${product.priceList.stock}`,
                category: category ? category.name : product.category,
                actions: {
                    deleteHandler: () => {
                        deleteModal({
                            onOk: async () => {
                                const res = await dispatch.vendorStore.deleteProduct(product._id);
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
                            <Col lg={9} xs={24}>
                                <Item name={'category'} label={'Categories'}>
                                    <Select placeholder={'Categories'} loading={categoryLoading}>
                                        {categories && categories.map(cat => {
                                            return (
                                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                            )
                                        })}
                                    </Select>
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
                    <Link href={routes.vendors.products.add}>
                        <Button
                            type={'link'}
                            icon={<PlusCircleOutlined className={'text-info mr-3'} style={{ fontSize: 20 }}/>}
                            className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                            disabled={categories.length === 0}
                        >
                            Add New Product
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>

                    <Table columns={columns} dataSource={data} scroll={{ x: 1100 }} pagination={false} loading={productsLoading && products.length === 0}/>
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

export default Products;