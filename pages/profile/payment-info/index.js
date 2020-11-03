import React, {useState} from 'react';
import {CreditCardOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Col, Row} from "antd";

import ProfileLayout from "../../../components/Layout/Profile";
import PaymentInfoCard from "../../../components/UI/PaymentInfoCard";
import cookie from "cookie";
import {getStore} from "../../../states";
import {useDispatch, useSelector} from "react-redux";
import deleteModal from "../../../components/Modals/Delete";
import moment from "moment";
import {useRouter} from "next/router";
import routes from "../../../constants/routes";
import Link from "next/link";
import userTypes from "../../../constants/userTypes";

const PaymentInfo = props => {
    const [deleted, setDeleted] = useState([]);
    const dispatch = useDispatch();
    const deleteLoading = useSelector(state => state.loading.effects.profile.deletePayment);
    const { payments } = props;
    const router = useRouter();

    const deletePayment = async id => {
        const res = await dispatch.profile.deletePayment(id);
        if(res) {
            setDeleted(deleted.concat(id));
        }
    }
    return (
        <ProfileLayout
            title={'Payment Info'}
            breadcrumb={[{ title: "User Profile" }]}
            actions={(
                <Link href={routes.profile.payments.new}>
                    <Button
                        type={'link'}
                        icon={<PlusOutlined className={'text-info mr-2'} style={{ fontSize: 12 }}/>}
                        className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                    >
                        New card
                    </Button>
                </Link>
            )}
        >
            <Row>

                {payments.length === 0 || payments.length === deleted.length ? (
                    <Col xs={24} className={'flex flex-col items-center justify-center pt-6'}>
                        <CreditCardOutlined className={'text-paragraph mb-6 text-4xl'} />
                        <span className="text-paragraph mb-4">You have no Card</span>
                    </Col>
                ) : payments.map((item, index) => {
                    if(deleted.includes(item._id)) {
                        return null;
                    }
                    return (
                        <Col xs={24} key={`card-${index}`}>
                            <PaymentInfoCard
                                card={`**** ${item.number.slice(-4)}`}
                                expireInfo={moment(item.expirationDate).format('MM/YY')}
                                editHandler={() => router.push(routes.profile.payments.edit(item._id))}
                                deleteHandler={() => deleteModal({
                                    onOk: deletePayment.bind(this, item._id),
                                    okText: 'Yes, Delete',
                                    title: "Delete Payment Card?",
                                    loading: deleteLoading
                                })}/>
                        </Col>
                    )
                })}
            </Row>
        </ProfileLayout>
    )
}


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let payments = [];
    if (!token) {
        res.writeHead(307, { Location: routes.auth.login });
        res.end();
        return {
            props: {
                payments
            }
        };
    }


    if(cookies.type !== 'customer') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                payments
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
        payments = response;
    }
    return {
        props: {
            payments
        }
    }
}

export default PaymentInfo;