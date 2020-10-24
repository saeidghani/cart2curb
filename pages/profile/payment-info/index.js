import React from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Row} from "antd";

import ProfileLayout from "../../../components/Layout/Profile";
import PaymentInfoCard from "../../../components/UI/PaymentInfoCard";

const PaymentInfo = props => {
    return (
        <ProfileLayout
            title={'Payment Info'}
            breadcrumb={[{ title: "User Profile" }]}
            actions={(
                <Button
                    type={'link'}
                    icon={<PlusOutlined className={'text-info mr-2'} style={{ fontSize: 12 }}/>}
                    className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                >
                    New card
                </Button>
            )}
        >
            <Row>
                {[...Array(3)].map((item, index) => {
                    return (
                        <Col xs={24} key={`card-${index}`}>
                            <PaymentInfoCard
                                cardType={'Visa'}
                                card={'**** 6501'}
                                expireInfo={'04/20'}
                                editHandler={console.log}
                                deleteHandler={console.log}/>
                        </Col>
                    )
                })}
            </Row>
        </ProfileLayout>
    )
}

export default PaymentInfo;