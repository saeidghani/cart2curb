import React, {useEffect} from 'react';
import {Space, Button, Row, Col, Grid, Spin} from 'antd';
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {LoadingOutlined} from '@ant-design/icons';

import ProfileLayout from "../../components/Layout/Profile";
import DetailItem from "../../components/UI/DetailItem";
import routes from "../../constants/routes";
import Avatar from "../../components/UI/Avatar";
import LogoutModal from "../../components/Modals/Logout";
import {getProperty} from "../../helpers";
import moment from "moment";
import {getStore} from "../../states";
import cookie from "cookie";
import {useAuth} from "../../providers/AuthProvider";
import {useRouter} from "next/router";
import userTypes from "../../constants/userTypes";
import {streamPreferences} from "../../constants";


const antIcon = <LoadingOutlined style={{fontSize: 36}} spin/>;


const {useBreakpoint} = Grid;


const profile = props => {
    const screens = useBreakpoint();
    const dispatch = useDispatch();
    const router = useRouter();
    const loading = useSelector(state => state.loading.effects.profile.getProfile);
    const {profile} = props;
    const {setAuthenticated, isAuthenticated, setUserType} = useAuth();

    const logoutHandler = async () => {
        await dispatch.auth.logout();
        setAuthenticated(false);
        setUserType(null)
        router.push(routes.auth.login);
    }

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(routes.auth.login);
        }
    }, [isAuthenticated])

    const actions = (
        <Space size={screens.lg ? 32 : screens.md ? 24 : screens.sm ? 12 : 8}>
            <Button type={'text'} className={'text-xs'} danger onClick={LogoutModal.bind(this, logoutHandler)}>Log
                Out</Button>
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
            breadcrumb={[{title: "User Profile"}]}
            actions={actions}
        >
            {loading ? (
                <div className="flex flex-row items-center justify-center py-10">
                    <Spin indicator={antIcon}/>
                </div>
            ) : (
                <Row gutter={[24, 32]} className={'flex flex-row flex-wrap items-center'}>
                    <Col xs={24} sm={12} lg={6}>
                        <div className="flex items-center">
                            <Avatar src={profile.image} justImage/>
                            <div className="text-paragraph text-xs ml-3">Your Score: {profile?.score}</div>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem title={'First Name'} value={getProperty(profile, 'firstName', '-')}/>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem title={'Last Name'} value={getProperty(profile, 'lastName', '-')}/>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem title={'Mobile'} value={getProperty(profile, 'phone', '-')}/>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem title={'Email'} value={getProperty(profile, 'email', '-')}/>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem title={'Birthdate'} value={moment(profile.birthdate).format('MM.DD.YYYY')}/>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <DetailItem
                            title={'LiveCart Viewing Preference'}
                            value={getProperty(profile, 'socialMedias', '-', (data) => {
                                let stream = data.find(item => item.streamOn === true);
                                if (stream) {
                                    return streamPreferences[stream.provider] || '-'
                                } else {
                                    return '-'
                                }
                            })}/>
                    </Col>
                    <Col xs={24} sm={12} lg={18} className={'flex flex-col justify-center'}>
                        <span className="text-type mb-1">Referral link:</span>
                            <a href="#" className="text-btn underline">{`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/signup?referralCode=${profile?.referralCode}`}</a>
                    </Col>
                </Row>
            )}

        </ProfileLayout>
    )
}

export async function getServerSideProps({req, res}) {

    let cookies = cookie.parse(req.headers.cookie || '');
    let token = cookies.token

    let profile = {};
    if (!token) {
        res.writeHead(307, {Location: routes.auth.login});
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    if (cookies.type !== 'customer') {
        res.writeHead(307, {Location: userTypes[cookies.type].profile});
        res.end();
        return {
            props: {
                profile
            }
        };
    }

    const store = getStore();
    const response = await store.dispatch.profile.getProfile({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response) {
        profile = response;
    }
    return {
        props: {
            profile
        }
    }
}

export default profile;