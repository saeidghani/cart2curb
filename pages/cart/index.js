import React, {useState, useMemo, useEffect} from 'react';
import {Button, Input, Radio, Table, Checkbox, InputNumber, Row, Col, Form, Select, message} from 'antd';
import {DeleteOutlined, LoadingOutlined} from '@ant-design/icons';

import Page from "../../components/Page";
import cookie from "cookie";
import routes from "../../constants/routes";
import {getStore} from "../../states";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useAuth} from "../../providers/AuthProvider";

const {Item} = Form;
const {Option} = Select;


const _expandedRowKeys = new Set();

const defaultSubstitutionOptions = [
    'Substitute at equal or lesser value',
    'Substitute at any price',
]

const substitutionOptions = [
    'Substitute at equal or lesser value',
    'Substitute at any price',
    'Leave a note'
]

export const CartIndex = (props) => {
    const {cart, stores} = props;
    const [form] = Form.useForm()
    const [products, setProducts] = useState([])
    const [deleted, setDeleted] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [total, setTotal] = useState(cart.hasOwnProperty('totalPrice') ? cart.totalPrice : 0);
    const [deleteLoading, setDeleteLoading] = useState(-1);
    const loading = useSelector(state => state.loading.effects.cart.updateCart);
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useAuth();


    useEffect(() => {
        if (cart.hasOwnProperty('totalPrice')) {
            const total = products.reduce((total, item) => total += Number(item.totalPrice), 0);
            setTotal(total.toFixed(2));
        }
    }, [cart, products])

    useEffect(() => {
        if (cart.hasOwnProperty('products')) {
            const transformedProducts = cart.products.map(product => {
                return {
                    _id: product._id,
                    subtitution: !product.subtitution ? undefined : defaultSubstitutionOptions.includes(product.subtitution) ? product.subtitution : 'Leave a note',
                    subtitutionDesc: !defaultSubstitutionOptions.includes(product.subtitution) ? product.subtitution : null,
                    quantity: product.quantity,
                    tax: (product.tax * product.price * product.quantity / 100).toFixed(2),
                    price: product.price,
                    totalPrice: product.totalPrice
                }
            })
            setExpandedRows(transformedProducts.map((_, i) => {
                return {
                    ..._,
                    index: i,
                }
            }).filter(_ => !!_.subtitution).map(_ => _.index));
            setProducts(transformedProducts);
        }

    }, [cart])

    const changeQuantity = async (value, index, productId) => {
        console.log('q:', value);
        if (value) {
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

            const productsSummary = cart.products.map(p => ({
                _id: p._id,
                subtitution: p?.subtitution,
                quantity: p?.quantity
            }));
            console.log({productsSummary});
            const index = productsSummary.findIndex(p => p._id === productId);
            console.log({index});
            productsSummary[index].quantity = value;
            const body = {
                products: productsSummary
            }
            console.log({body});
            const res = await dispatch.cart.updateCartItems(body);
            if (res) {
                message.success('Cart updated successfully');
            }
            setProducts(newProducts);
        }
    }

    const changeSubtitution = (value, index, key, changeState = true) => {
        const newProducts = [...products];
        newProducts[index] = {
            ...newProducts[index],
            [key]: !value ? undefined : typeof value === 'boolean' ? defaultSubstitutionOptions[0] : value,
        }
        if (changeState && (value && !_expandedRowKeys.has(index) || !value && _expandedRowKeys.has(index))) {
            _expandedRowKeys.has(index)
                ? _expandedRowKeys.delete(index)
                : _expandedRowKeys.add(index);

            setExpandedRows(Array.from(_expandedRowKeys.values()));
        }

        setProducts(newProducts);
    }

    const deleteItem = (id, index) => {
        setDeleted(deleted => [...deleted, id])
        setProducts(oldProducts => {
            return oldProducts.filter((_, i) => i !== index);
        })

        if (_expandedRowKeys.has(index)) {
            _expandedRowKeys.delete(index)
            setExpandedRows(Array.from(_expandedRowKeys.values()));
        }
    }

    const submitHandler = async (values) => {
        const transformedProducts = []
        const body = {
            note: values.notes || '',
        }
        for (let i in products) {
            if (!deleted.includes(products[i])) {
                const product = products[i];
                const quantity = product.quantity;
                const _id = product._id;
                const subtitution = !product.subtitution ? null : defaultSubstitutionOptions.includes(product.subtitution) ? product.subtitution : product.subtitutionDesc ? product.subtitutionDesc : product.subtitution || 'Substitute at equal or lesser value'

                transformedProducts.push({
                    _id,
                    quantity,
                    subtitution
                })
            }
        }
        body.products = transformedProducts;
        try {
            const result = await dispatch.cart.updateCart(body);
            if (result) {
                if (auth.isAuthenticated && auth.userType === 'customer') {
                    router.push(routes.cart.delivery)
                } else {
                    router.push(routes.cart.guest.index);
                }
            }
        } catch (e) {
            return false;
        }

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
            render: data => <span
                className="text-cell">{data?.length > 90 ? `${data.substring(0, 90)}...` : data}</span>
        },
        {
            title: 'Substitution',
            dataIndex: 'subtitution',
            key: 'subtitution',
            render: (data, row) => {
                return (
                    <>
                        <Checkbox className={'text-cell checkbox-info pr-8'}
                                  onChange={e => changeSubtitution(true, row.index, 'subtitution')}
                                  checked={products[row.index]?.subtitution}>Yes</Checkbox>
                        <Checkbox className={'text-cell checkbox-info'}
                                  onChange={e => changeSubtitution(false, row.index, 'subtitution')}
                                  checked={!products[row.index]?.subtitution}>No</Checkbox>
                    </>
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
                    <InputNumber min={1} defaultValue={data} size={'sm'} className={'cart-number-input'}
                                 onChange={(e) => changeQuantity(e, row.index, row.key)}/>
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
                        <Button type='link' shape={'circle'}
                                className="flex items-center justify-center btn-icon-small text-cell hover:text-cell"
                                onClick={row.deleteHandler}>
                            {row.key === deleteLoading ? (
                                <LoadingOutlined/>
                            ) : (
                                <DeleteOutlined/>
                            )}
                        </Button>
                    </div>
                )
            }
        },
    ];

    const data = useMemo(() => {
        if (cart.hasOwnProperty('products')) {
            return cart.products.filter(product => !deleted.includes(product._id)).map((product, index) => {
                console.log(product);
                let totalPrice = product.totalPrice;
                let tax = product.tax * product.price * product.quantity / 100

                if (products[index]) {
                    tax = products[index].tax;
                    totalPrice = products[index].totalPrice;
                }
                return {
                    key: product._id,
                    index: index,
                    product: product.name,
                    subtitution: !!product.subtitution,
                    price: `$${product.price}`,
                    tax: `$${tax}`,
                    store: stores.find(store => store._id === product.store)?.name,
                    quantity: product.quantity,
                    total: `$${totalPrice}`,
                    deleteHandler: async () => {
                        setDeleteLoading(product._id);
                        const res = await dispatch.cart.deleteFromCart(product._id);
                        if (res) {
                            changeQuantity(0, index);
                            message.success('Products deleted successfully!')
                            deleteItem(product._id, index);
                        }
                        setDeleteLoading(-1);
                    }
                }
            })
        }
        return [];
    }, [cart, products, stores, deleted]);

    return (
        <Page title="Cart" breadcrumb={[{title: 'Cart'}]}>
            <div className="mt-2">
                <Table columns={columns}
                       dataSource={data}
                       pagination={false}
                       scroll={{x: 1100}}
                       rowKey={'index'}
                       expandable={{
                           expandIcon: () => null,
                           expandedRowKeys: expandedRows,
                           expandIconColumnIndex: 2,
                           expandedRowRender(row, index) {
                               const product = products.filter(product => !deleted.includes(product._id))[index];

                               return (
                                   <div className={'flex flex-col items-stretch'}>
                                       <div
                                           className={`flex items-center justify-between cart-substitution pt-3 ${product.subtitution === 'Leave a note' ? 'pb-5' : 'pb-3'}`}>
                                           <span className={'text-cell text-sm'}>Item #{index + 1} Substitution</span>
                                           <Radio.Group options={substitutionOptions}
                                                        onChange={e => changeSubtitution(e.target.value, index, 'subtitution', false)}
                                                        value={product.subtitution}/>
                                       </div>
                                       {product.subtitution === 'Leave a note' && (
                                           <div className="flex flex-col items-stretch">
                                               <label htmlFor={`substitution-${index}`}
                                                      className={'text-label text-sm pb-2'}>Notes</label>
                                               <Input.TextArea
                                                   value={product.subtitutionDesc}
                                                   onChange={e => changeSubtitution(e.target.value, index, 'subtitutionDesc', false)}
                                                   placeholder={'Notes'}
                                                   id={`substitution-${index}`}
                                                   autoSize={{minRows: 5, maxRows: 8}}
                                                   style={{resize: 'none'}}/>
                                           </div>
                                       )}
                                   </div>
                               )
                           }
                       }}
                />
            </div>
            <Row gutter={24}>
                <Col xs={24} className={'flex flex-col md:flex-row-reverse'}>
                    <Item>
                        <Button type={'primary'} onClick={submitHandler} className="w-full md:w-32 mt-4 md:mt-8"
                                htmlType={'submit'} loading={loading}
                                disabled={!cart.products || cart.products?.length === 0 || cart.products?.length === deleted.length}>Next</Button>
                    </Item>
                </Col>
            </Row>
        </Page>
    );
};

export async function getServerSideProps({req, res}) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;

    let authenticated = !!token;
    let cart = {}
    let stores = [];
    if (userType && !['customer', 'vendor'].includes(userType)) {
        res.writeHead(307, {Location: routes.auth.login});
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
        let response;
        if (token && userType === 'customer') {
            response = await store.dispatch.cart.getCart({
                headers: {
                    ...req.headers,
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            response = await store.dispatch.cart.getCart({
                headers: {
                    ...req.headers
                }
            });
        }

        if (response) {
            cart = response;

            if (cart.hasOwnProperty('stores')) {
                for (let i in cart.stores) {
                    const storeId = cart.stores[i];
                    const storeResponse = await store.dispatch.app.getStore(storeId);
                    if (storeResponse) {
                        stores.push(storeResponse);
                    }
                }
            }
        }
    } catch (e) {
        return {
            props: {
                authenticated,
                cart,
                stores,
            }
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
