import React from 'react';

import ProfileLayout from "../../components/Layout/Profile";

const profile = props => {
    return (
        <ProfileLayout title={false} breadcrumb={[{ title: "User Profile" }]}>
            Account details
        </ProfileLayout>
    )
}

export default profile;