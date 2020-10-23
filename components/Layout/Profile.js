import React from 'react';
import { Row, Col } from 'antd';

import Page from '../Page';
import ProfileNavigation from "../ProfileNavigation";

const ProfileLayout = ({title, breadcrumb, ...props}) => {
    return (
        <Page title={title} breadcrumb={breadcrumb}>
            <Row gutter={32} className="flex md:flex-row flex-col">
                <Col xs={24} md={8} lg={6} className={'hidden md:flex md:flex-col'}>
                    <ProfileNavigation/>
                </Col>
                <Col xs={24} md={16} lg={18}>
                    {props.children}
                </Col>
            </Row>
        </Page>
    )
}

export default ProfileLayout;