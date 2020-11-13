import React, {useState} from 'react';
import {
    useElements,
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

const CheckoutForm = ({ onComplete, backHref }) => {
    const [form] = Form.useForm();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (values) => {
        const formFields = form.getFieldsValue()
        console.log(formFields);
        const cardNumber = elements.getElement(CardNumberElement);
        setLoading(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumber,
            billing_details: {
                name: `${formFields.firstName} ${formFields.lastName}`
            }
        })

        if(error) {
            message.error(error.message);
            setLoading(false);
            return false;
        } else {
            const clientSecret = await dispatch.cart.checkout({
                paymentMethod: paymentMethod.id
            })
            if(clientSecret) {
                const payment = await stripe.handleCardAction(clientSecret);
                if(payment.error) {
                    message.error('Your card was not authenticated, please try again')
                    setLoading(false);
                    return false;
                } else {
                    if(payment.paymentIntent.status === "requires_confirmation") {
                        const response = await dispatch.cart.confirmCheckout({
                            paymentIntentId: payment.paymentIntent.id
                        })

                        if(response) {
                            setLoading(false);
                            onComplete(true);

                        } else {
                            message.error('An Error was occurred, please try again later');
                            setLoading(false);
                            return false;
                        }
                    }
                }
            }
        }
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
                    <Item name={'card-number'} label={'Card Number'} rules={[
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                console.log(value)
                                if(!value || value.empty) {
                                    return Promise.reject('Card Number is required');
                                }
                                if(value.error) {
                                    return Promise.reject(value.error.message);
                                }
                                if(!value.complete) {
                                    return Promise.reject('Please enter complete Card Number');
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}>
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
                                        color: '#242b36',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'firstName'} label={'First Name'} rules={[
                        {
                            required: true,
                            message: 'First Name is required',
                        },
                        {
                            min: 3,
                            message: "First Name should be at least 3 characters"
                        }
                    ]}>
                        <Input placeholder="First Name" />
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'cvc'} label={'CVC'} rules={[
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if(!value || value.empty) {
                                    return Promise.reject('CVC is required');
                                }
                                if(value.error) {
                                    return Promise.reject(value.error.message);
                                }
                                if(!value.complete) {
                                    return Promise.reject('Please enter valid CVC');
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}>
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
                                        color: '#242b36',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item name={'lastName'} label={'Last Name'} rules={[
                        {
                            required: true,
                            message: 'Last Name is required',
                        },
                        {
                            min: 3,
                            message: "Last Name should be at least 3 characters"
                        }
                    ]}>
                        <Input placeholder="Last Name" />
                    </Item>
                </Col>
                <Col md={12} xs={24}>
                    <Item label={'Expiration Date'} name='expiration-date' rules={[
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if(!value || value.empty) {
                                    return Promise.reject('Expiration Date is required');
                                }
                                if(value.error) {
                                    return Promise.reject(value.error.message);
                                }
                                if(!value.complete) {
                                    return Promise.reject('Please enter complete Expiration Date');
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}>
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
                                        color: '#242b36',
                                        borderColor: '#FF4B45'
                                    },
                                },
                            }}/>
                    </Item>
                </Col>

                <Col md={12} xs={24} className={'flex items-end flex-row-reverse mb-6'}>
                    <Item className={'mb-0'}>
                        <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={loading}>
                            Pay
                        </Button>
                    </Item>
                    <Item className={'mb-0'}>
                        <Link href={backHref || routes.cart.invoice.index}>

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