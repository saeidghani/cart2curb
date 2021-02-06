import React, {useState, useMemo, useEffect} from 'react';
import {Button, Input, Table, Checkbox, InputNumber, Row, Col, Form, Select, message} from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

import Page from "../../../components/Page";
import cookie from "cookie";
import routes from "../../../constants/routes";
import {getStore} from "../../../states";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useAuth} from "../../../providers/AuthProvider";
import withAuth from "../../../components/hoc/withAuth";

const { Item } = Form;
const { Option } = Select;

export const CustomCart = (props) => {
    const [form] = Form.useForm()
    const [products, setProducts] = useState([])
    const [deleted, setDeleted] = useState([]);
    const [total, setTotal] = useState(0);
    const [store, setStore] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(-1);
    const loading = useSelector(state => state.loading.effects.customCart.updateCart);
    const cartId = useSelector(state => state.customCart.cartId);
    const cart = useSelector(state => state.customCart.cart);
    const dispatch = useDispatch();
    const router = useRouter()
    const auth = useAuth()

    const getStore = async (id) => {
        const res = await dispatch.app.getStore(id);
        if(res) {
            setStore(res);
        }
    }

    useEffect(() => {
        if(cartId && !store && cart?.stores?.length > 0) {
            getStore(cart?.stores?.[0])
        }
    }, [store, cart, cartId])

    useEffect(() => {
        if(!cartId) {
            message.error('Please create new Order first!')
            router.push(routes.vendors.orders.index);
        }
    }, [cartId])

    useEffect(() => {
        if(cart.hasOwnProperty('totalPrice')) {
            const total = products.reduce((total, item) => total += Number(item.totalPrice), 0);
            setTotal(total.toFixed(2));
        }
    }, [cart, products])

    useEffect(() => {
        if(cart.hasOwnProperty('products')) {
            const transformedProducts = cart.products.map(product => {
                return {
                    _id: product._id,
                    quantity: product.quantity,
                    tax: (product.tax * product.price * product.quantity / 100).toFixed(2),
                    price: product.price,
                    totalPrice: product.totalPrice
                }
            })
            setProducts(transformedProducts);
        }

    }, [cart])

    const changeQuantity = (value, index) => {
        const newProducts = [...products];
        const price = value * newProducts[index].price
        const tax = (cart.products[index].tax * price / 100).toFixed(2)
        const totalPrice = (Number(price) + Number(tax)).toFixed(2)
        newProducts[index] = {
            ...newProducts[index],
            tax,
            totalPrice,
            quantity: value
        }

        setProducts(newProducts);
    }

    const submitHandler = async (values) => {
        const transformedProducts = {}
        const body = {
            note: values.notes || '',
        }
        for(let i in products) {
            if(!deleted.includes(products[i])) {
                const product = products[i];
                const quantity = product.quantity;
                const _id = product._id;

                transformedProducts[_id] = {
                    quantity
                }
            }
        }
        body.products = transformedProducts;
        try {
            const result = await dispatch.customCart.updateCart(body);
            if(result) {
                await dispatch.customCart.getCart(cartId)
                router.push(routes.vendors.customCart.delivery);
            }
        } catch(e) {
            return false;
        }

    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => <span className="text-cell">{data + 1}</span>,
            colSpan: 1,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Quantity/Weight',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 160,
            render: (data, row) => {
                return (
                    <InputNumber min={1} defaultValue={data} size={'sm'} className={'cart-number-input'} onChange={e => changeQuantity(e, row.index)}/>
                )
            }
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
            width: 140,
            render: (data, row) => {
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-cell">{data}</span>
                        <Button type='link' shape={'circle'} className="flex items-center justify-center btn-icon-small text-cell hover:text-cell" onClick={row.deleteHandler}>
                            {row.key === deleteLoading ? (
                                <LoadingOutlined />
                            ) : (
                                <DeleteOutlined />
                            )}
                        </Button>
                    </div>
                )
            }
        },
    ];

    const data = useMemo(() => {
        if(cart.hasOwnProperty('products')) {
            return cart.products.filter(product => !deleted.includes(product._id)).map((product, index) => {
                let totalPrice = product.totalPrice;
                let tax = product.tax * product.price * product.quantity / 100

                if(products[index]) {
                    tax = products[index].tax;
                    totalPrice = products[index].totalPrice;
                }
                return {
                    key: product._id,
                    index: index,
                    product: product.name,
                    price: `$${product.price}`,
                    tax: `$${tax}`,
                    store: store?.name || '-',
                    quantity: product.quantity,
                    total: `$${totalPrice}`,
                    deleteHandler: async () => {
                        setDeleteLoading(product._id);
                        const res = await dispatch.customCart.deleteFromCart(product._id);
                        if(res) {
                            await dispatch.customCart.getCart(res);
                            changeQuantity(0, index);
                            message.success('Products deleted successfully!')
                            setDeleted(deleted => [...deleted, product._id])
                        }
                        setDeleteLoading(-1);
                    }
                }
            })
        }
        return [];
    }, [cart, products, store, deleted]);

    return (
        <Page title="Cart" breadcrumb={[{ title: 'Cart'}]}>
            <div className="mt-2">

                <Table
                    columns={columns}
                    scroll={{ x: 1100 }}
                    dataSource={data}
                    pagination={false}
                />
            </div>
            <div className={'flex flex-row-reverse items-start pt-6 pb-8'}>
                {cart?.products?.filter(product => !deleted.includes(product._id)).length > 0 && (
                    <div className="flex flex-col" style={{ width: 210, paddingLeft: 10 }}>
                        <h1 className="text-left text-4.5xl text-paragraph font-medium mb-2 mt-0">${total}</h1>
                        <span className="text-xs text-header">+ ${cart.serviceFee} Service Fee</span>
                    </div>
                )}
            </div>

            <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation} initialValues={{
                notes: cart.note
            }}>
                <Row gutter={24}>
                    <Col xs={24}>
                        <Item name={'notes'} label={'Notes'}>
                            <Input.TextArea placeholder="Notes" style={{ resize: 'none' }} autoSize={{ minRows: 5, maxRows: 8 }} />
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse'}>
                        <Item>
                            <Button type={'primary'} className="w-full md:w-32 mt-4 md:mt-8" htmlType={'submit'} loading={loading} disabled={!cart.products || cart.products?.length === 0}>Next</Button>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    );
};

export default withAuth(CustomCart, 'vendor');
