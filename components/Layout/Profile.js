import React from 'react';
import { Row, Col, Divider } from 'antd';

import Page from '../Page';
import ProfileNavigation from "../ProfileNavigation";

const ProfileLayout = ({title, breadcrumb, actions, ...props}) => {
    return (
        <Page title={false} breadcrumb={breadcrumb}>
            <Row gutter={32} className="flex md:flex-row flex-col">
                <Col xs={24} md={8} lg={6} className={'hidden md:flex md:flex-col'}>
                    <ProfileNavigation/>
                </Col>
                <Col xs={24} md={16} lg={18}>
                    {title && (
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <h1 className="page__title text-2xl text-label font-medium my-0">{title}</h1>
                                <div className="actions flex items-center">{actions || null}</div>
                            </div>
                            <Divider/>
                        </div>
                    )}
                    <div className="w-full">
                        {props.children}
                    </div>
                </Col>
            </Row>
        </Page>
    )
}

export default ProfileLayout;