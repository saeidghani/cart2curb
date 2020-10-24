import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import ProfileLayout from "../../../components/Layout/Profile";
import AddressCard from "../../../components/UI/AddressCard";

const addresses = props => {
    return (
        <ProfileLayout title={'Addresses'} breadcrumb={[{ title: "User Profile" }]}>
            <Row>
                {[...Array(3)].map((item, index) => {
                    return (
                        <Col xs={24} key={`address-${index}`}>
                            <AddressCard title={`Address ${index + 1}`} value={'3334 Brew Creek Rd, Pender Harbour, British Columbia, Canada, V0N 2H0'} deleteHandler={console.log}/>
                        </Col>
                    )
                })}

                <Col xs={24}>
                    <Button
                        type={'link'}
                        icon={<PlusOutlined className={'text-info mr-3'} style={{ fontSize: 12 }}/>}
                        className={'flex items-center justify-center text-info px-0 hover:text-teal-500 text-base'}
                    >
                        Add New Address
                    </Button>
                </Col>
            </Row>
        </ProfileLayout>
    )
}

export default addresses;