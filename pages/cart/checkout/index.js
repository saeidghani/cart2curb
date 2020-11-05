import React from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    DatePicker,
    Divider
} from 'antd';

import Page from '../../../components/Page';
import cookie from "cookie";
import routes from "../../../constants/routes";
import {getStore} from "../../../states";

const { Item } = Form;

const GuestCheckout = props => {
    const [form] = Form.useForm();

    const { cart } = props;


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

    return (
        <Page title={'Guest Cart'} breadcrumb={breadcrumb}>
            <h2 className="text-type font-medium text-base mb-6">Credit Card Info</h2>
            <Row gutter={[24, 24]} align={'stretch'}>
                <Col md={8} xs={24}>
                    <div className="pb-6 w-full h-full">
                        <div className="border border-input rounded-sm px-7.5 py-4.5 h-full">
                            <Row>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Cart Price</span>
                                    <span className="text-type font-medium">$12.65</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Subtitution</span>
                                    <span className="text-type font-medium">$6.20</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Delivery</span>
                                    <span className="text-type font-medium">$8.00</span>
                                </Col>
                                <Col span={24} className="flex items-center justify-between py-3">
                                    <span className="text-overline">Promo Code</span>
                                    <span className="text-type font-medium">-${cart.cartPrice}</span>
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
                <Col md={16} xs={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                    >
                        <Row gutter={24}>
                            <Col md={12} xs={24}>
                                <Item name={'card-number'} label={'Card Number'}>
                                    <Input placeholder="Card Number" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'firstname'} label={'First Name'}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'cvv'} label={'Cvv'}>
                                    <Input placeholder="Cvv" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item name={'lastname'} label={'Last Name'}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Item label={'Expiration Date'} className={'mb-0'}>
                                    <Row gutter={24}>

                                        <Col xs={12}>
                                            <Item name={'year'}>
                                                <DatePicker className={'w-full'} picker={'year'}/>
                                            </Item>
                                        </Col>
                                        <Col xs={12}>
                                            <Item name={'month'}>
                                                <DatePicker className={'w-full'} picker={'month'} format={'MMMM'}/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Item>
                            </Col>

                            <Col md={12} xs={24} className={'flex items-center flex-row-reverse'}>
                                <Item className={'mb-0'}>
                                    <Button type="primary" className={'w-32 ml-5'}>
                                        Next
                                    </Button>
                                </Item>
                                <Item className={'mb-0'}>
                                    <Button danger className={'w-32'}>
                                        Prev
                                    </Button>
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

export default GuestCheckout;