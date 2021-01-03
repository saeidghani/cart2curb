import React, {useEffect} from 'react';
import {Button, Col, Divider, Space, Grid, Row} from "antd";
import Link from "next/link";
import cookie from "cookie";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";

import Page from "../Page";
import routes from "../../constants/routes";
import userTypes from "../../constants/userTypes";
import LogoutModal from "../Modals/Logout";
import Avatar from "../UI/Avatar";
import DetailItem from "../UI/DetailItem";
import {getStore} from "../../states";
import {getProperty} from "../../helpers";
import {useAuth} from "../../providers/AuthProvider";

const Details = props => {
    const screens = Grid.useBreakpoint();
    const { profile } = props;
    const dispatch = useDispatch();
    const router = useRouter();

/*    useEffect(() => {
        dispatch.adminStore?.getStore(storeId);
    }, [storeId]);*/

    const address = [profile?.store?.address?.addressLine1];
    if(profile?.store?.address?.addressLine2) {
        address.push(profile?.store?.address?.addressLine2);
    }
    address.push(profile?.store?.address?.city);
    address.push(profile?.store?.address?.province);
    address.push(profile?.store?.address?.country);

    return (
        <Page title={false} headTitle={'Profile'} breadcrumb={[{ title: 'Vendor Profile' }]}>
            <Row>
                <Col xs={24} className={`flex flex-col`}>
                    <div className="flex items-center justify-between">
                        <h1 className="page__title text-2xl text-type font-medium my-0">Vendor profile</h1>
                    </div>
                    <Divider/>
                </Col>
                <Col xs={24}>
                    <Row gutter={[24, 36]} className={'flex flex-row flex-wrap items-center pt-4'}>
                        <Col xs={24} sm={12} lg={6}>
                            <Avatar src={profile?.image} justImage/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Company Name'} value={getProperty(profile?.store, 'name', '-')}/>
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
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Opening Hour'} value={getProperty(profile?.store, 'openingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Store Closing Hour'} value={getProperty(profile?.store, 'closingHour', '-', (data) => moment(data).format("HH:mm A"))}/>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Gathering Method'} value={!profile?.store?.hasOwnProperty('needDriversToGather') ? '-' : profile.store.needDriversToGather ? 'by Cart2Curb' : 'by Store'}/>
                        </Col>
                        <Col xs={24}>
                            <DetailItem labelColor={'muted'} valueColor={'dark'} title={'Description'} value={getProperty(profile?.store, 'description', '-')}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    )
}


/*export async function getServerSideProps({ req, res }) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token


    let profile = {};

    if (!token) {
        res.writeHead(307, { Location: routes.admin.auth.login });
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
}*/

export default Details;