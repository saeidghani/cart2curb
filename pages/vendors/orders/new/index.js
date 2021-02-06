import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";

import withAuth from "../../../../components/hoc/withAuth";
import Page from '../../../../components/Page';
import routes from "../../../../constants/routes";
import Loader from "../../../../components/UI/Loader";
import {useRouter} from "next/router";

const { Item } = Form;
const { Option } = Select;

let isIntersecting = true;
const NewOrder = props => {
    const loader = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const categoryLoading = useSelector(state => state.loading.effects.vendorStore.getCategories);
    const productsLoading = useSelector(state => state.loading.effects.vendorStore.getProducts);
    const addToCartLoading = useSelector(state => state.loading.effects.customCart.addToCart);
    const cartId = useSelector(state => state.customCart.cartId);
    const products = useSelector(state => state.vendorStore.products.data);

    useEffect(() => {
        if(!cartId) {
            message.error('Please create new Order first!')
            router.push(routes.vendors.orders.index);
        }
    }, [cartId])

    useEffect(async () => {
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
                const response = await dispatch.vendorStore.getProducts(body)
                if(response.data.length < 15) {
                    setHasMore(false);
                }
            } catch(e) {
                setHasMore(false);
                message.error('An Error was occurred while fetching data')
            }
        }
        isIntersecting = true;
    }, [page, selectedCategory, search])

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
                        <Button
                            danger
                            style={{ height: 40, padding: '6px 19px'}}
                            disabled={addToCartLoading}
                            onClick={actions.addToCart}
                        >
                            Add to Cart
                        </Button>
                    </div>
                )
            },
            width: 145,
        },
    ]


    const data = useMemo(() => {
        return products && products.map((product, index) => {
            const category = categories.find(cat => cat._id === product.category)
            return {
                key: product._id,
                index: product._id,
                number: product._id,
                name: product.name,
                unitPrice: `$${product.priceList.price}`,
                price: `$${product.priceList.cost}`,
                tax: `${product.tax}%`,
                stock: `${product.stock}`,
                category: category ? category.name : product.category,
                actions: {
                    addToCart: async () => {
                        const cartId = await dispatch.customCart.addToCart({
                            productId: product._id,
                            quantity: 1
                        })

                        if(cartId) {
                            await dispatch.customCart.getCart(cartId);
                        }
                    }
                },
            }
        })
    }, [products, categories])

    return (
        <Page breadcrumb={[{ title: 'Products List' }]} title={'Product List'}>
            <Row gutter={24} className={'flex items-center pt-6 pb-4'}>
                <Col lg={18} xs={24}>
                    <Form form={form} layout={'vertical'} onFinish={searchHandler}>
                        <Row gutter={24}>
                            <Col lg={9} xs={24}>
                                <Item name={'search'} label={'Search'}>
                                    <Input allowClear placeholder={'Search'} />
                                </Item>
                            </Col>
                            <Col lg={9} xs={24}>
                                <Item name={'category'} label={'Categories'}>
                                    <Select placeholder={'Categories'} loading={categoryLoading}>
                                        <Option value={'all'}>All</Option>
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
        </Page>
    )
}

export default withAuth(NewOrder, 'vendor');