import React, {useEffect} from 'react';
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    message,
    DatePicker
} from 'antd';

import Page from '../../../../components/Page';
import routes from "../../../../constants/routes";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import cookie from "cookie";
import {getStore} from "../../../../states";
import moment from "moment";
import Link from "next/link";
import userTypes from "../../../../constants/userTypes";

const { Item } = Form;

const EditPaymentInfo = props => {

    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.addPayment);

    useEffect(() => {
        if(props.status) {
            const payment = props.payment;
            const expirationDate = moment(payment.expirationDate || '');
            form.setFieldsValue({
                firstName: payment.firstName || '',
                lastName: payment.lastName || '',
                cvv: payment.cvv || '',
                number: payment.number || "",
                year: expirationDate,
                month: expirationDate
            })
        } else {
            router.push(routes.profile.payments.index);
        }
    }, [props.status, form])

    const breadcrumb = [
        {
            title: "User Profile",
            href: routes.profile.index
        },
        {
            title: "Payment Info",
            href: routes.profile.payments.index
        },
        {
            title: `Edit **** ${props.payment.number.slice(-4)}`
        }
    ]


    const submitHandler = async (values) => {
        const {number, firstName, lastName, cvv, year, month} = values;
        const expirationDate = year.format('YYYY') + '-' + month.format("MM-DD")
        const body = {
            number,
            firstName,
            lastName,
            cvv,
            expirationDate
        }


        const result = await dispatch.profile.addPayment(body)
        if (result) {
            router.push(routes.profile.payments.index);
        }
    }

    const checkValidation = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0], 5);
    }

    return (
        <Page title={false} breadcrumb={breadcrumb}>
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        onFinish={submitHandler}
                        onFinishFailed={checkValidation}
                    >
                        <Row gutter={24}>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'number'} label={'Card Number'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Card number"
                                    },
                                    {
                                        pattern: /^[0-9]{16}$/g,
                                        message: 'Please enter Valid Card Number',
                                    }
                                ]}>
                                    <Input placeholder="Card Number" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'firstName'} label={'First Name'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter Card Owner First Name"
                                    },
                                    {
                                        min: 3,
                                        message: "First name should be at least 3 character"
                                    }
                                ]}>
                                    <Input placeholder="First Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'cvv'} label={'Cvv'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter Card CVV"
                                    },
                                    {
                                        pattern: /^[0-9]+$/g,
                                        message: 'Please enter Valid CVV',
                                    }
                                ]}>
                                    <Input placeholder="Cvv" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item name={'lastName'} label={'Last Name'} rules={[
                                    {
                                        required: true,
                                        message: "Please enter Card Owner Last Name"
                                    },
                                    {
                                        min: 3,
                                        message: "Last name should be at least 3 character"
                                    }
                                ]}>
                                    <Input placeholder="Last Name" />
                                </Item>
                            </Col>
                            <Col lg={8} md={12} xs={24}>
                                <Item label={'Expiration Date'} className={'mb-0'}>
                                    <Row gutter={24}>

                                        <Col xs={12}>
                                            <Item name={'year'} rules={[
                                                {
                                                    required: true,
                                                    message: "Required"
                                                },
                                            ]}>
                                                <DatePicker className={'w-full'} picker={'year'}/>
                                            </Item>
                                        </Col>
                                        <Col xs={12}>
                                            <Item name={'month'} rules={[
                                                {
                                                    required: true,
                                                    message: "Required"
                                                },
                                            ]}>
                                                <DatePicker className={'w-full'} picker={'month'} format={'MMMM'}/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Item>
                            </Col>

                            <Col xs={24} className={'flex items-center flex-row-reverse pt-2'}>
                                <Item className={'mb-0'}>
                                    <Button type="primary" className={'w-32 ml-5'} htmlType={'submit'} loading={loading}>
                                        Save
                                    </Button>
                                </Item>
                                <Item className={'mb-0'}>
                                    <Link href={routes.profile.payments.index}>

                                        <Button danger className={'w-32'}>
                                            Cancel
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
export async function getServerSideProps({ req, params, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let status = false;
    let payment = null;
    if (!token) {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                status,
                payment
            }
        };
    }

    if(cookies.type !== 'customer') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                status,
                payment
            }
        };
    }

    const store = getStore();
    const response = await store.dispatch.profile.getPayments({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(response) {
        let index = response.findIndex(item => item._id === params.payment);
        if(index > -1) {
            payment = response[index];
            status = true;
        } else {
            res.setHeader("location", routes.profile.payments.index);
            res.statusCode = 302;
            res.end();
        }
    }
    return {
        props: {
            payment,
            status
        }
    }
}


export default EditPaymentInfo;