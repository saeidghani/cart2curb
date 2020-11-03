import React, {useState, useMemo, useEffect} from 'react';
import {Button, Input, Table, Checkbox, InputNumber, Row, Col, Form, Select, message} from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

import Page from "../../components/Page";
import cookie from "cookie";
import routes from "../../constants/routes";
import {getStore} from "../../states";
import {useDispatch, useSelector} from "react-redux";

const { Item } = Form;
const { Option } = Select;

export const CartIndex = (props) => {
    const { cart, stores } = props;
    const [form] = Form.useForm()
    const [products, setProducts] = useState([])
    const [deleted, setDeleted] = useState([]);
    const [total, setTotal] = useState(cart.hasOwnProperty('totalPrice') ? cart.totalPrice : 0);
    const [deleteLoading, setDeleteLoading] = useState(-1);
    const dispatch = useDispatch();

    useEffect(() => {
        if(cart.hasOwnProperty('totalPrice')) {
            const total = products.reduce((total, item) => total += Number(item.totalPrice), 0) + Number(cart.deliveryCost) + Number(cart.serviceFee);
            setTotal(total.toFixed(2));
        }
    }, [cart, products])

    useEffect(() => {
        if(cart.hasOwnProperty('products')) {
            const transformedProducts = cart.products.map(product => {
                return {
                    _id: product._id,
                    substituted: !!product.substitutions,
                    substitutions: !products.substitutions ? undefined : ['I need exact item', 'Do substitute'].includes(product.substitutions) ? product.substitutions : 'Do substitute',
                    substitutionsDesc: !['I need exact item', 'Do substitute'].includes(product.substitutions) ? product.substitutions : null,
                    quantity: product.quantity,
                    tax: (product.tax * product.totalPrice / 100).toFixed(2),
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

    const changeSubstitutions = (value, index, key) => {
        const newProducts = [...products];
        newProducts[index] = {
            ...newProducts[index],
            [key]: value,
        }
        setProducts(newProducts);
    }

    const submitHandler = async (values) => {
        console.log(values);
        console.log(products);
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: data => <span className="text-cell">{data + 1}</span>
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: data => <span className="text-cell">{data}</span>
        },
        {
            title: 'Substitutions',
            dataIndex: 'substitutions',
            key: 'substitutions',
            render: (data, row) => {
                return (
                    <Checkbox className={'text-cell checkbox-info'} onChange={e => changeSubstitutions(e.target.checked, row.index, 'substituted')} checked={products[row.index]?.substituted}>{products[row.index]?.substituted ? "Yes" : "No"}</Checkbox>
                )
            }
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
            title: 'Total',
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
                let tax = product.tax * product.totalPrice / 100

                if(products[index]) {
                    tax = products[index].tax;
                    totalPrice = products[index].totalPrice;
                }
                return {
                    key: product._id,
                    index: index,
                    product: product.name,
                    substitutions: !!product.substitutions,
                    price: `$${product.price}`,
                    tax: `$${tax}`,
                    store: stores.find(store => store._id === product.store)?.name,
                    quantity: product.quantity,
                    total: `$${totalPrice}`,
                    deleteHandler: async () => {
                        setDeleteLoading(product._id);
                        const res = await dispatch.cart.deleteFromCart(product._id);
                        if(res) {
                            changeQuantity(0, index);
                            message.success('Products deleted successfully!')
                            setDeleted([...deleted, product._id])
                        }
                        setDeleteLoading(-1);
                    }
                }
            })
        }
        return [];
    }, [cart, products, stores, deleted]);

    return (
        <Page title="Cart" breadcrumb={[{ title: 'Cart'}]}>
            <div className="mt-2">
                <Table columns={columns}
                       dataSource={data}
                       pagination={false}
                       scroll={{ x: 1100 }}
                />
            </div>
            <div className={'flex flex-row-reverse items-start pt-6 pb-8'}>
                {cart.products.filter(product => !deleted.includes(product._id)).length > 0 && (
                    <div className="flex flex-col pl-4" style={{ width: 210 }}>
                        <h1 className="text-left text-4.5xl text-paragraph font-medium mb-2 mt-0">${total}</h1>
                        <span className="text-xs text-header">+ ${cart.serviceFee} Service Fee</span>
                    </div>
                )}
            </div>

            <Form form={form} layout={'vertical'} onFinish={submitHandler} onFinishFailed={checkValidation}>
                <Row gutter={24}>
                    {products.map((product, key) => {
                        if(product.substituted) {
                            return (
                                <>
                                    <Col lg={8} md={12} xs={24}>
                                        <Item name={`substitution-${key + 1}`} label={`Item #${key + 1} Substitution`}>
                                            <Select placeholder={'I need exact item (Do not substitute)'} onChange={value => changeSubstitutions(value, key, 'substitutions')} defaultValue={product.substitutions}>
                                                <Option value={'I need exact item'}>I need exact item (Do not substitute)</Option>
                                                <Option value={'Do substitute'}>Do substitute</Option>
                                            </Select>
                                        </Item>
                                    </Col>
                                    {product.substitutions === 'Do substitute' && (
                                        <Col lg={16} md={12} xs={24}>
                                            <Item name={`substitution-${key + 1}-desc`} label={'Your Substitution'}>
                                                <Input placeholder={'I need exact item (Do not substitute)'} defaultValue={product.substitutionsDesc} onChange={e => changeSubstitutions(e.target.value, key, 'substitutionsDesc')}/>
                                            </Item>
                                        </Col>
                                    )}

                                </>
                            )
                        }
                    })}

                    <Col xs={24}>
                        <Item name={'notes'} label={'Notes'}>
                            <Input.TextArea placeholder="Notes" style={{ resize: 'none' }} autoSize={{ minRows: 5, maxRows: 8 }} />
                        </Item>
                    </Col>
                    <Col xs={24} className={'flex flex-col md:flex-row-reverse'}>
                        <Item>
                            <Button type={'primary'} className="w-full md:w-32 mt-4 md:mt-8" htmlType={'submit'} disabled={cart.products.length === 0}>Next</Button>
                        </Item>
                    </Col>
                </Row>
            </Form>
        </Page>
    );
};

export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;

    let authenticated = !!token;
    let cart = {}
    let stores = [];
    if (userType && userType !== 'customer') {
        res.writeHead(307, { Location: routes.homepage });
        res.end();
        return {
            props: {
                authenticated,
                cart,
                stores,
            }
        };
    }
    const store = getStore();
    try {
        const response = await store.dispatch.cart.getCart({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response) {
            cart = response;

            if(cart.hasOwnProperty('stores')) {
                for(let i in cart.stores) {
                    const storeId = cart.stores[i];
                    const storeResponse = await store.dispatch.app.getStore(storeId);
                    if(storeResponse) {
                        stores.push(storeResponse);
                    }
                }
            }
        }
    } catch(e) {
        return {
            authenticated,
            cart,
            stores,
        }
    }

    return {
        props: {
            authenticated,
            cart,
            stores,
        }
    };

}

export default CartIndex;
