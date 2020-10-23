import React from 'react';

import ProfileLayout from "../../../components/Layout/Profile";

const Orders = props => {
    return (
        <ProfileLayout title={false} breadcrumb={[{ title: "User Profile" }]}>
            Orders
        </ProfileLayout>
    )
}

export default Orders;