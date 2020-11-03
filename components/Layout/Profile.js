import React from 'react';
import { Row, Col, Divider } from 'antd';

import Page from '../Page';
import ProfileNavigation from "../ProfileNavigation";

const ProfileLayout = ({title, breadcrumb, actions, withoutDivider, ...props}) => {
    return (
        <Page title={false} breadcrumb={breadcrumb}>
            <Row gutter={32} className="flex md:flex-row flex-col items-stretch">
                <Col xs={24} md={8} lg={6} className={'hidden md:flex md:flex-col'}>
                    <ProfileNavigation/>
                </Col>
                <Col xs={24} md={16} lg={18}>
                    {title && (
                        <div className={`flex flex-col ${withoutDivider && 'mb-6'}`}>
                            <div className="flex items-center justify-between">
                                <h1 className="page__title text-2xl text-type font-medium my-0">{title}</h1>
                                <div className="actions flex items-center">{actions || null}</div>
                            </div>
                            {!withoutDivider && (<Divider/>)}
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