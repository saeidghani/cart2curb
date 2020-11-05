import React, {useState} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    DatePicker,
    Divider
} from 'antd';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import Page from '../../../components/Page';
import cookie from "cookie";
import routes from "../../../constants/routes";
import {getStore} from "../../../states";
import Link from "next/link";
import CheckoutForm from "../../../components/CheckoutForm";
import env from "../../../constants/env";
import CheckoutSuccess from "../../../components/CheckoutSuccess";

const { Item } = Form;

const stripePromise = loadStripe(env.stripe.key);

const Checkout = props => {
    const [completed, setCompleted] = useState(false);
    const { cart } = props;

    const completeCheckoutHandler = (value) => {
        setCompleted(value)
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

    return completed ? (
        <CheckoutSuccess cart={cart}/>
    ) : (
        <Page title={'Guest Cart'} breadcrumb={breadcrumb}>
            <h2 className="text-type font-medium text-base mb-6">Credit Card Info</h2>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col md={8} xs={24}>
                    <div className="pb-6 w-full h-full">
                        <div className="border border-input rounded-sm px-7.5 py-4.5 h-full">
                            <Row>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Cart Price</span>
                                    <span className="text-type font-medium">${cart.cartPrice}</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Service Fee</span>
                                    <span className="text-type font-medium">${cart.serviceFee}</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Delivery</span>
                                    <span className="text-type font-medium">${cart.deliveryCost}</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Promo Code</span>
                                    <span className="text-type font-medium">-{cart.hasOwnProperty('promo') && cart.promo?.hasOwnProperty('off') ? `$${(Number(cart.promo.off) * Number(cart.cartPrice) / 100).toFixed(2)}` : ""}</span>
                                </Col>
                                <Divider className={'my-2'}/>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Total Price</span>
                                    <span className="text-type font-medium text-xl">${cart.totalPrice}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>

                <Elements stripe={stripePromise}>
                    <Col md={16} xs={24}>
                        <CheckoutForm onComplete={completeCheckoutHandler}/>
                    </Col>
                </Elements>
            </Row>
        </Page>
    )
}


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token
    let userType = cookies.type;

    let cart = {}
    if (userType && userType !== 'customer') {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                cart,
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

        if(response) {
            cart = response;
            if(!cart.products || cart.products.length === 0) {
                res.writeHead(307, { Location: routes.cart.index });
                res.end();
                return {
                    props: {
                        cart,
                    }
                };
            }
            if(!cart.deliveryTime || !cart.address) {
                res.writeHead(307, { Location: routes.cart.delivery });
                res.end();
                return {
                    props: {
                        cart,
                    }
                };
            }

        }
    } catch(e) {
        return {
            cart,
        }
    }

    return {
        props: {
            cart,
        }
    };

}

export default Checkout;