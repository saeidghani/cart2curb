import React from 'react';

import ProfileLayout from "../../../components/Layout/Profile";

const PaymentInfo = props => {
    return (
        <ProfileLayout title={false} breadcrumb={[{ title: "User Profile" }]}>
            Payment Info
        </ProfileLayout>
    )
}

export default PaymentInfo;