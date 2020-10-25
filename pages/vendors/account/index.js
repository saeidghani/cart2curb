import React from 'react';
import {Button, Col, Divider, Space, Grid, Row} from "antd";
import Link from "next/link";

import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import LogoutModal from "../../../components/Modals/Logout";
import Avatar from "../../../components/UI/Avatar";
import DetailItem from "../../../components/UI/DetailItem";

const Account = props => {
    const screens = Grid.useBreakpoint();
    return (
        <Page title={false} breadcrumb={[{ title: 'Vendor Profile' }]}>
            <Row>
                <Col xs={24} className={`flex flex-col`}>
                    <div className="flex items-center justify-between">
                        <h1 className="page__title text-2xl text-label font-medium my-0">Account</h1>
                        <div className="actions flex items-center">
                            <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
                                <Button type={'text'} danger onClick={LogoutModal.bind(this, () => console.log('you logged out'))}>Logout</Button>
                                <Link href={routes.vendors.account.changePassword}>
                                    <Button type={'text'} className={'text-type text-base font-medium'}>Change Password</Button>
                                </Link>
                                <Link href={routes.vendors.account.edit}>
                                    <Button type={'text'} className={'text-info hover:text-teal-500 text-base font-medium'}>Edit</Button>
                                </Link>
                            </Space>
                        </div>
                    </div>
                    <Divider/>
                </Col>
                <Col xs={24}>
                    <Row gutter={[24, 36]} className={'flex flex-row flex-wrap items-center pt-4'}>
                        <Col xs={24} sm={12} lg={6}>
                            <Avatar title={'Your Score: 4200'} justImage/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Company Name'} value={'John'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Main Contact Name'} value={'Doe'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Mobile'} value={'+1 234 (567) 8910'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Email'} value={'user@info.com'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Store Opening Hour'} value={'8:00 AM'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Store Closing Hour'} value={'11:00 PM'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Gathering Method'} value={'by Cart2Curb'}/>
                        </Col>
                        <Col xs={24}>
                            <DetailItem title={'Description'} value={'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'}/>
                        </Col>

                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Type'} value={'Type'}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem title={'Sub Type'} value={'Sub Type'}/>
                        </Col>

                        <Col xs={24}>
                            <DetailItem title={'Address'} value={'Adress Line 2, Address Line 1, City, State, Country, Zip Code'}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    )
}

export default Account;