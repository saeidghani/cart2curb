import React from 'react';

import ProfileLayout from "../../../components/Layout/Profile";

const addresses = props => {
    return (
        <ProfileLayout title={false} breadcrumb={[{ title: "User Profile" }]}>
            Addresses
        </ProfileLayout>
    )
}

export default addresses;