import React, {useEffect} from 'react';
import {Button, Col, Divider, Space, Grid, Row, message} from "antd";
import Link from "next/link";

import Page from "../../../components/Page";
import routes from "../../../constants/routes";
import LogoutModal from "../../../components/Modals/Logout";
import Avatar from "../../../components/UI/Avatar";
import DetailItem from "../../../components/UI/DetailItem";
import cookie from "cookie";
import {getStore} from "../../../states";
import {getProperty} from "../../../helpers";
import moment from "moment";
import {useAuth} from "../../../providers/AuthProvider";
import {useDispatch} from "react-redux";
import userTypes from "../../../constants/userTypes";
import {useRouter} from "next/router";

const Account = props => {
    const screens = Grid.useBreakpoint();
    const { profile } = props;
    const dispatch = useDispatch();
    const router = useRouter()
    const { setAuthenticated, setUserType, isAuthenticated } = useAuth();

    const logoutHandler = async () => {
        await dispatch.auth.logout();
        setAuthenticated(false);
        setUserType(null)
    }

    useEffect(() => {
        if(!isAuthenticated) {
            router.push(routes.vendors.auth.login);
        }
    }, [isAuthenticated])


    const address = [profile.store?.address?.addressLine1];
    if(profile.store?.address?.addressLine2) {
        address.push(profile.store?.address?.addressLine2);
    }
    address.push(profile.store?.address?.city);
    address.push(profile.store?.address?.province);
    address.push(profile.store?.address?.country);

    return (
        <Page title={false} headTitle={'Profile'} breadcrumb={[{ title: 'Vendor Profile' }]}>
            <Row>
                <Col xs={24} className={`flex flex-col`}>
                    <div className="flex items-center justify-between">
                        <h1 className="page__title text-2xl text-type font-medium my-0">Account</h1>
                        <div className="actions flex items-center">
                            <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
                                <Button type={'text'} className={'text-xs'} danger onClick={LogoutModal.bind(this, logoutHandler)}>Log Out</Button>
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
                            <Avatar src={profile.image} justImage/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Company Name'} value={getProperty(profile.store, 'name', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Main Contact Name'} value={getProperty(profile, 'contactName', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Mobile'} value={getProperty(profile, 'phone', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Email'} value={getProperty(profile, 'email', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Opening Hour'} value={getProperty(profile.store, 'openingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Closing Hour'} value={getProperty(profile.store, 'closingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Gathering Method'} value={!profile.store.hasOwnProperty('needDriversToGather') ? '-' : profile.store.needDriversToGather ? 'by Cart2Curb' : 'by Store'}/>
                        </Col>
                        <Col xs={24}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Description'} value={getProperty(profile.store, 'description', '-')}/>
                        </Col>

                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Type'} value={getProperty(profile.store, 'storeType', '-')}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Sub Type'} value={getProperty(profile.store, 'subType', '-')}/>
                        </Col>

                        <Col xs={24}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Address'} value={address.join(", ")}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    )
}


export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token


    let profile = {};

    if (!token) {
        res.writeHead(307, { Location: routes.vendors.auth.login });
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    if(cookies.type !== 'vendor') {
        res.writeHead(307, { Location: userTypes[cookies.type].profile });
        res.end();
        return {
            props: {
                profile
            }
        };
    }



    const store = getStore();
    const response = await store.dispatch.vendorProfile.getProfile({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(response) {
        profile = response;
    }
    return {
        props: {
            profile
        }
    }
}

export default Account;