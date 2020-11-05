import React from 'react';
import {
    useStripe,
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
} from "@stripe/react-stripe-js";
import {Button, Col, DatePicker, Form, Input, message, Row} from "antd";
import Link from "next/link";
import routes from "../../constants/routes";
import {useDispatch} from "react-redux";

const { Item } = Form;

const CheckoutForm = () => {
    const [form] = Form.useForm();
    const stripe = useStripe();
    const disaptch = useDispatch();

    const submitHandler = async (values) => {
        console.log(values);
        console.log(stripe);
    }

    const checkValidation = errorInfo => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }
    return (
        <Form
            form={form}
            layout="vertical"
            className="flex flex-col"
            onFinishFailed={checkValidation}
            onFinish={submitHandler}
        >
            <Row gutter={24}>
                <Col md={12} xs={24}>
                    <Item name={'card-number'} label={'Card Number'}>
                        <CardNumberElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '14px',
                                        color: '#242b36',
                                        border: '1px solid #d9d9d9',
                                        height: 40,
                                        width: '100%',
                                        '::placeholder': {
                                            color: '#bfbfbf',
                                            fontSize: '12px'
                                        },
                                    },
                                    invalid: {
                                        color: '#FF4B45',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'firstname'} label={'First Name'}>
                        <Input placeholder="First Name" />
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'cvv'} label={'CVV'}>
                        <CardCvcElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '14px',
                                        color: '#242b36',
                                        border: '1px solid #d9d9d9',
                                        height: 40,
                                        width: '100%',
                                        '::placeholder': {
                                            color: '#bfbfbf',
                                            fontSize: '12px'
                                        },
                                    },
                                    invalid: {
                                        color: '#FF4B45',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'lastname'} label={'Last Name'}>
                        <Input placeholder="Last Name" />
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item label={'Expiration Date'} className={'mb-0'}>
                        <CardExpiryElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '14px',
                                        color: '#242b36',
                                        border: '1px solid #d9d9d9',
                                        height: 40,
                                        width: '100%',
                                        '::placeholder': {
                                            color: '#bfbfbf',
                                            fontSize: '12px'
                                        },
                                    },
                                    invalid: {
                                        color: '#FF4B45',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>

                <Col md={12} xs={24} className={'flex items-end flex-row-reverse'}>
                    <Item className={'mb-0'}>
                        <Button type="primary" className={'w-32 ml-5'}>
                            Pay
                        </Button>
                    </Item>
                    <Item className={'mb-0'}>
                        <Link href={routes.cart.invoice.index}>

                            <Button danger className={'w-32'}>
                                Prev
                            </Button>
                        </Link>
                    </Item>
                </Col>
            </Row>

        </Form>
    )
}

export default CheckoutForm;