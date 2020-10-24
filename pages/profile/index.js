import React from 'react';
import { Space, Button, Row, Col, Grid } from 'antd';
import Link from "next/link";

import ProfileLayout from "../../components/Layout/Profile";
import DetailItem from "../../components/UI/DetailItem";
import routes from "../../constants/routes";
import Avatar from "../../components/UI/Avatar";


const { useBreakpoint } = Grid;

const profile = props => {
    const screens = useBreakpoint();

    const actions = (
        <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
            <Button type={'text'} danger>Logout</Button>
            <Link href={routes.profile.changePassword}>
                <Button type={'text'} className={'text-type text-base font-medium'}>Change Password</Button>
            </Link>
            <Link href={routes.profile.edit}>
                <Button type={'text'} className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
            </Link>
        </Space>
    )
    return (
        <ProfileLayout
            title={'Account'}
            breadcrumb={[{ title: "User Profile" }]}
            actions={actions}
        >
            <Row gutter={[24, 32]} className={'flex flex-row flex-wrap items-center'}>
                <Col xs={24} sm={12} lg={6}>
                    <Avatar title={'Your Score: 4200'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'First Name'} value={'Barry'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Last Name'} value={'Wood'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Mobile'} value={'+1 234 (567) 8910'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Email'} value={'barry@gmail.com'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Birthdate'} value={'02.08.1990'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Stream Preference'} value={'Zoom'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Instagram'} value={'@Barry_Wood'}/>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <DetailItem title={'Facebook'} value={'johndoe'}/>
                </Col>
                <Col xs={24} sm={12} lg={18} className={'flex flex-col justify-center'}>
                    <span className="text-type mb-1">Share the link with your freind and get more score:</span>
                    <a href="#" className="text-btn underline">Card2curb/barry/wood/come</a>
                </Col>
            </Row>
        </ProfileLayout>
    )
}

export default profile;