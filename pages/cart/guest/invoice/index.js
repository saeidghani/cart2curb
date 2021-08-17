import React, {useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider,
    Select,
    Space,
    TimePicker,
    Radio,
    Table, message
} from 'antd';
import { useDebouncedCallback } from 'use-debounce';

import { DollarOutlined } from '@ant-design/icons';
import Page from '../../../../components/Page';
import {HeaderLogoIcon} from "../../../../components/icons";
import DetailItem from "../../../../components/UI/DetailItem";
import cookie from "cookie";
import routes from "../../../../constants/routes";
import {getStore} from "../../../../states";
import Link from "next/link";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

const { Item } = Form;
const { Option } = Select;

Number.prototype.toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
}


const Invoices = props => {
    const [form] = Form.useForm();
    const [orderDate, setOrderDate] = useState(moment());
    const [deliveryTime, setDeliveryTime] = useState(moment(props.cart.deliveryTime || ''));
    const [tip, setTip] = useState(props?.cart?.tip || 0);
    const [promo, setPromo] = useState(props.cart.promo);
    const [isCustom, setIsCustom] = useState(false);
    const [totalPrice, setTotalPrice] = useState(props.cart?.totalPrice);
    const [currentPrice, setCurrentPrice] = useState(props.cart?.priceAfterPromoTip);
    const [promoPrice, setPromoPrice] = useState(props.cart?.totalPrice)
    const [loading, setLoading] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const customTipDebounce = useDebouncedCallback(
        (value) => {
            changeTipHandler(value)
        },
        600
    )

    const { stores, cart } = props;

    const changeTipHandler = async (value, isOption = false) => {
        if(isOption) {
            setIsCustom(false);
        }
        if(!(Number(value) <= 100 && Number(value) >= 0)) {
            const cart = await dispatch.cart.getClientCart();
            if(cart) {
                setPromo(cart?.promo);
                setTotalPrice(cart?.totalPrice);
                setCurrentPrice(cart?.priceAfterPromoTip);
                setPromoPrice(cart?.totalPrice);
            }

            return;
        }

        const body = {
            tip: {
                t: 'percent',
                val: Number(value)
            },
        }
        console.log(body);
        const res = await dispatch.cart.promoTip(body)
        if(res) {
            const cart = await dispatch.cart.getClientCart();
            if(cart) {
                setPromo(cart?.promo);
                setTotalPrice(cart?.totalPrice);
                setCurrentPrice(cart?.priceAfterPromoTip);
                setPromoPrice(cart?.totalPrice);
            }

            setTip({
                t: 'percent',
                val: Number(value)
            });
        }
    }

    const applyCustomTipHandler = async () => {
        const body = {
            tip: {t: 'fixed', val: Number(tip?.val)},
        }
        const res = await dispatch.cart.promoTip(body)
        if(res) {
            const cart = await dispatch.cart.getClientCart();
            if(cart) {
                setPromo(cart?.promo);
                setTotalPrice(cart?.totalPrice);
                setCurrentPrice(cart?.priceAfterPromoTip);
                setPromoPrice(cart?.totalPrice);
            }
        }
    }

    const customTipHandler = (e) => {
        const value = e.target.value;
        setTip({t: 'fixed', val: value});
        if((Number(value) >= 0)) {
            form.setFieldsValue({
                tip: Number(value)
            })
        }
    }

    const breadcrumb = [
        {
            title: 'Cart',
            href: routes.cart.index
        },
        {
            title: 'Delivery',
            href: routes.cart.guest.index
        },
        {
            title: 'Invoice'
        }
    ]

    const columns = [
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
        },
        {
            title: 'Cart Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Delivery Cost',
            dataIndex: 'delivery',
            key: 'delivery',
        },
        {
            title: 'Service Fee',
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
    ];

    const data = [
        {
            key: 'cart',
            items: cart?.totalQuantity || '-',
            price: cart?.cartPrice ? `$${cart?.cartPrice?.toFixed(2)}` : '-',
            delivery: cart?.deliveryCost ? `$${cart?.deliveryCost?.toFixed(2)}` : '-',
            service: cart?.serviceFee ? `$${cart?.serviceFee?.toFixed(2)}` : '-',
            tax: cart?.hst ? `$${cart?.hst?.toFixed(2)}` : '-',
            totalPrice: cart?.totalPrice ? `$${cart?.totalPrice?.toFixed(2)}` : '-',
        }
    ]

    const transformed = [cart?.address?.addressLine1];
    if(cart?.address?.addressLine2) {
        transformed.push(cart?.address?.addressLine2);
    }
    transformed.push(cart?.address?.city);
    transformed.push(cart?.address?.province);
    transformed.push(cart?.address?.country);

    const applyPromoHandler = async (e) => {
        e.preventDefault();
        const value = form.getFieldValue('promo');
        if(!value) {
            message.info('Please enter Promo code first');
            return false;
        }
        setPromoLoading(true);

        const body = {
            promoCode: value,
            tip: tip?.val
        }

        const res = await dispatch.cart.promoTip(body)
        if(res) {
            const cart = await dispatch.cart.getClientCart();
            if(cart) {
                setPromo(cart?.promo);
                setTotalPrice(cart?.totalPrice);
                setCurrentPrice(cart?.priceAfterPromoTip);
                setPromoPrice(cart?.totalPrice);
            }

            setPromoLoading(false);
            message.success('Promo Code applied!')
        } else {
            setPromoLoading(false);
        }
    }

    const submitHandler = async (values) => {
        setLoading(true);
        const  {paymentType} = values;
        const checkoutBody = {
            paymentMethod: paymentType
        };
        // const checkoutRes = await dispatch.cart.checkout(checkoutBody);
        const res = await dispatch.cart.confirmCart(checkoutBody)
        if(/* checkoutRes && */ res) {
            message.success('Cart Information updated successfully!')
            setLoading(false);
            router.push({pathname: routes.cart.checkout, query: {orderId: res?.orderId}});
        } else {
            setLoading(false);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    const paymentTypes = [
        {name: 'Debit at the door', val: 'Debit at the door'},
        {name: 'Interac e-transfer', val: 'Interac e-transfer'},
        {name: 'Secure Credit Card', val: 'Secure Credit Card'},
        {name: 'Exact Cash', val: 'Exact Cash'},
    ];

    return (
        <Page title={'Checkout'} breadcrumb={breadcrumb}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={18}>
                    <HeaderLogoIcon/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Date'} value={orderDate.format('MM.DD.YYYY')}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Company'} value={'Cart2Curb'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={'+548-883-2278'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={'orders@cart2curb.ca'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Number'} value={cart.orderNumber ?? cart._id}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'mb-5 mt-6'}/>
                </div>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Customer Name'} value={`${cart?.guest?.firstName} ${cart?.guest?.lastName}`}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={cart?.guest?.phone}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={cart?.guest?.email}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Date'} value={orderDate.format('MM.DD.YYYY')}/>
                </Col>

                <Col xs={24} md={12}>
                    <DetailItem title={'Address'} value={transformed.join(", ")}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Scheduled Delivery Time'} value={`${deliveryTime.format('MM.DD.YYYY')} | ${deliveryTime.format("HH:mm")}`}/>
                </Col>
                <Col xs={24}>
                    <DetailItem title={'Comments'} value={cart.note}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'mb-5 mt-6'}/>
                </div>
                {stores.map((store, index) => {
                    return (
                        <Col xs={24} md={12} lg={6} key={store._id}>
                            <DetailItem title={`Store #${index + 1} Name`} value={store.name}/>
                        </Col>
                    )
                })}

                <Col xs={24}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1000 }}
                    />
                </Col>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        initialValues={{
                            tip: tip?.t === 'fixed' ? tip?.val : 0,
                        }}
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row gutter={24}>
                            <Col lg={24} md={12} xs={24} className={'md:pt-7 mb-6'}>
                                <Space size={16}>
                                    <div className="">Tips</div>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 0 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 0, true)}>0%</Button>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 5 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 5, true)}>5%</Button>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 10 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 10, true)}>10%</Button>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 15 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 15, true)}>15%</Button>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 20 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 20, true)}>20%</Button>
                                    <Button className={'w-16'} type={(tip?.t === 'percent' && tip?.val === 25 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 25, true)}>25%</Button>
                                    <Button className={'w-22 ml-6'} type={isCustom ? 'primary' : 'normal'} danger onClick={setIsCustom.bind(this, true)}>Custom</Button>
                                    <Item className="" name={'tip'} label={'Value'} rules={[
                                        ({getFieldValue}) => ({
                                            validator(rule, value) {
                                                const transformedValue = Number(value);
                                                if (!value || (transformedValue >= 0)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Tip should be larger than 0');
                                            },
                                        })
                                    ]}>
                                        <Input
                                            className="mb-1"
                                            placeholder={tip?.t === 'fixed' ? `${tip?.val}$` : 0}
                                            value={tip?.t === 'fixed' ? tip?.val : 0}
                                            onChange={customTipHandler}
                                            disabled={!isCustom}
                                        />
                                    </Item>
                                    <Button className={'w-32'} danger size={'lg'} onClick={applyCustomTipHandler} loading={promoLoading} disabled={!isCustom}>Apply</Button>
                                </Space>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item
                                    name={'paymentType'}
                                    label={'Payment Type'}
                                    rules={[{
                                        required: true,
                                        message: 'Please select payment type'
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={'Select'}
                                        onChange={() => {}}
                                    >
                                        {paymentTypes.map(type => {
                                            return (
                                                <Option value={type.val}>{type.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'promo'} label={'Promo Code'}>
                                    <Input placeholder={'Promo Code'} onPressEnter={applyPromoHandler}/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24} className={'md:pt-7'}>
                                <Button className={'w-32'} danger size={'lg'} onClick={applyPromoHandler} loading={promoLoading}>Apply</Button>
                            </Col>

                            <Col lg={8} md={12} xs={24} className={'flex flex-row-reverse items-center'}>
                                <div className="flex items-center pl-4 justify-end">
                                    {(promo || tip?.val) && (<h1 className="text-right text-4.5xl text-paragraph font-medium my-0 mr-6">${currentPrice}</h1>)}
                                </div>
                            </Col>
                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={loading}>
                                        Checkout
                                    </Button>
                                </Item>
                                <Item>
                                    <Link href={routes.cart.guest.index}>
                                        <Button danger className={'w-32'}>
                                            Prev
                                        </Button>
                                    </Link>
                                </Item>
                            </Col>
                            <Col span={24}>
                                <div className="flex justify-end text-xs">All prices are estimates. You will always only be charged the actual store price after we purchase the goods.</div>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>
        </Page>
    )
}

export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;

    let cart = {}
    let stores = [];
    if(userType) {
        if(userType === 'customer') {
            res.writeHead(307, { Location: routes.cart.invoice.index });
            res.end();
            return {
                props: {
                    stores,
                    cart,
                }
            };
        } else if(userType !== 'vendor') {
            res.writeHead(307, { Location: routes.auth.login });
            res.end();
            return {
                props: {
                    cart,
                    stores,
                }
            };
        }
    }
    const store = getStore();
    try {
        let response;
        response = await store.dispatch.cart.getCart({
            headers: {
                ...req.headers
            }
        });


        if(response) {
            cart = response;
            if(!cart.products || cart.products.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                        stores,
                    }
                };
            }
            if(!cart.deliveryTime || !cart.address) {
                res.writeHead(307, { Location: routes.cart.guest.index });
                res.end();
                return {
                    props: {
                        cart,
                        stores,
                    }
                };
            }

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
            cart,
            stores,
        }
    }

    return {
        props: {
            cart,
            stores,
        }
    };

}
export default Invoices;
