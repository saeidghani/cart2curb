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
    const [tip, setTip] = useState(props.cart.tip || 0);
    const [promo, setPromo] = useState(props.cart.promo);
    const [isCustom, setIsCustom] = useState(false);
    const [promoPrice, setPromoPrice] = useState(props.cart.totalPrice)
    const [loading, setLoading] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const { profile, stores, cart } = props;

    const changeTipHandler = (value, isOption = false) => {
        if(isOption) {
            setIsCustom(false);
        }
        if(!(Number(value) <= 100 && Number(value) >= 0)) {
            let cartPrice = Number(cart.cartPrice) + Number(cart.deliveryCost) + Number(cart.serviceFee);
            if(promo.hasOwnProperty('off')) {
                cartPrice -= (promo.off / 100) * cart.cartPrice;
            }
            setPromoPrice(cartPrice.toFixedNoRounding(2));
            return;
        }

        let cartPrice = cart.cartPrice * (1 + value / 100) + Number(cart.deliveryCost) + Number(cart.serviceFee);
        if(promo.hasOwnProperty('off')) {
            cartPrice -= (promo.off / 100) * cart.cartPrice;
        }
        setTip(Number(value));
        setPromoPrice(cartPrice.toFixedNoRounding(2));
        form.setFieldsValue({
            tip: Number(value)
        })
    }

    const breadcrumb = [
        {
            title: 'Cart',
            href: routes.cart.index
        },
        {
            title: 'Delivery',
            href: routes.cart.delivery
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
    ];

    const data = [
        {
            key: 'cart',
            items: cart.totalQuantity,
            price: `$${cart.cartPrice}`,
            delivery: `$${cart.deliveryCost}`,
            service: `$${cart.serviceFee}`
        }
    ]

    const transformed = [cart.address.addressLine1];
    if(cart.address.addressLine2) {
        transformed.push(cart.address.addressLine2);
    }
    transformed.push(cart.address.city);
    transformed.push(cart.address.province);
    transformed.push(cart.address.country);

    const applyPromoHandler = async (e) => {
        e.preventDefault();
        setPromoLoading(true)
        const value = form.getFieldValue('promo');
        if(!value) {
            message.info('Please enter Promo code first');
            return false;
        }

        const body = {
            promoCode: value
        }

        const res = await dispatch.cart.promoTip(body)
        if(res) {
            const cart = await dispatch.cart.getClientCart();
            if(cart) {
                let cartPrice = cart.cartPrice * (1 + tip / 100) + Number(cart.deliveryCost) + Number(cart.serviceFee);
                if(cart.promo.hasOwnProperty('off')) {
                    cartPrice -= (cart.promo.off / 100) * cart.cartPrice;
                }
                setPromo(cart.promo);
                console.log(cartPrice);
                setPromoPrice(cartPrice.toFixedNoRounding(2));
            }

            setPromoLoading(false)
            message.success('Promo Code applied!')
        } else {

            setPromoLoading(false)
        }
    }

    const submitHandler = async (values) => {
        setLoading(true);
        const body = {
            tip,
        }

        const res = await dispatch.cart.promoTip(body)
        if(res) {
            message.success('Cart Information updated successfully!')
            setLoading(false);
            router.push(routes.cart.checkout);
        } else {
            message.error('An Error was occurred');
            setLoading(false);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }


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
                    <DetailItem title={'Phone Number'} value={'+1 234 (567) 7342'}/>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={'info@Cart2curb.com'}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Order Number'} value={cart._id}/>
                </Col>

                <div className="w-full px-3">
                    <Divider className={'mb-5 mt-6'}/>
                </div>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Customer Name'} value={`${profile.firstName} ${profile.lastName}`}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Phone Number'} value={profile.phone}/>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <DetailItem title={'Email Address'} value={profile.email}/>
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
                            tip,
                        }}
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'tip'} label={'Tip'} rules={[
                                    ({getFieldValue}) => ({
                                        validator(rule, value) {
                                            const transformedValue = Number(value);
                                            if (!value || (transformedValue >= 0 && transformedValue <= 100)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Tip should be between 0 and 100');
                                        },
                                    })
                                ]}>
                                    <Input placeholder={`${tip}%`} onChange={e => changeTipHandler(e.target.value)} disabled={!isCustom}/>
                                </Item>
                            </Col>
                            <Col lg={16} md={12} xs={24} className={'md:pt-7 mb-6'}>
                                <Space size={16}>
                                    <Button className={'w-16'} type={(tip === 10 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 10, true)}>10%</Button>
                                    <Button className={'w-16'} type={(tip === 15 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 15, true)}>15%</Button>
                                    <Button className={'w-16'} type={(tip === 20 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 20, true)}>20%</Button>
                                    <Button className={'w-16'} type={(tip === 25 && !isCustom) ? 'primary' : 'normal'} danger onClick={changeTipHandler.bind(this, 25, true)}>25%</Button>
                                    <Button className={'w-22'} type={(![10, 15, 20, 25].includes(tip) || isCustom) ? 'primary' : 'normal'} danger onClick={setIsCustom.bind(this, true)}>Custom</Button>
                                </Space>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'promo'} label={'Promo'}>
                                    <Input placeholder={'Promo'} onPressEnter={applyPromoHandler}/>
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24} className={'md:pt-7'}>
                                <Button className={'w-32'} danger size={'lg'} onClick={applyPromoHandler} loading={promoLoading}>Apply</Button>
                            </Col>

                            <Col lg={8} md={12} xs={24} className={'flex flex-row-reverse items-center'}>
                                <div className="flex flex-col pl-4 justify-end">
                                    <h1 className="text-right text-4.5xl text-paragraph font-medium mt-0">${promoPrice}</h1>
                                </div>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-8'}>
                                <Item>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={loading}>
                                        Next
                                    </Button>
                                </Item>
                                <Item>
                                    <Link href={routes.cart.delivery}>
                                        <Button danger className={'w-32'}>
                                            Prev
                                        </Button>
                                    </Link>
                                </Item>
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

    let profile = {};
    let cart = {}
    let stores = [];
    if (userType && userType !== 'customer') {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                profile,
                cart,
                stores,
            }
        };
    }
    const store = getStore();
    try {
        let response;
        response = await store.dispatch.cart.getCart({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const profileRes = await store.dispatch.profile.getProfile({
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(profileRes) {
            profile = profileRes;
        }

        if(response) {
            cart = response;
            if(!cart.products || cart.products.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        profile,
                        cart,
                        stores,
                    }
                };
            }
            if(!cart.deliveryTime || !cart.address) {
                res.writeHead(307, { Location: routes.cart.delivery });
                res.end();
                return {
                    props: {
                        profile,
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
            profile,
            cart,
            stores,
        }
    };

}
export default Invoices;