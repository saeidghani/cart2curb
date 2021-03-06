import React, {useEffect, useMemo, useState} from 'react';
import {Badge, Button, Drawer, Row, Col, Dropdown, Menu} from 'antd';
import Link from 'next/link'
import {BellTwoTone, MenuOutlined, SettingTwoTone} from '@ant-design/icons';

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from "../../constants/routes";
import './styles.less';
import {useAuthenticatedUserType, useIsAuthenticated, useIsAuthRoute} from "../../hooks/auth";
import {useRouter} from "next/router";
import Avatar from "../UI/Avatar";
import {useDispatch, useSelector} from "react-redux";
import userTypes from "../../constants/userTypes";
import HeaderLink from "./HeaderLink";
import {isCustomCartRoute} from "../../helpers";
import {useAuth} from "../../providers/AuthProvider";

const {Item} = Menu;

const MainHeader = props => {
    const [visible, setVisible] = useState(false);
    const [avatarImage, setAvatarImage] = useState('');
    const [isVendorPage, setIsVendorPage] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const isAuthRoute = useIsAuthRoute();
    const router = useRouter();
    const userType = useAuthenticatedUserType()
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const cart = useSelector(state => state?.cart?.cart);
    const customCart = useSelector(state => state?.customCart?.cart)
    const cartChanges = useSelector(state => state?.cart?.cartChanges);
    const {setAuthenticated, setUserType} = useAuth();

    useEffect(() => {
        if (visible) {
         setVisible(false);
        }
    }, [router.pathname]);


    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        dispatch?.cart?.getClientCart();
    }, [token, cartChanges]);

    useEffect(() => {
        if (userType) {
            if (props.avatar) {
                setAvatarImage(props.avatar);
            }
        } else {
            setAvatarImage('');
        }

    }, [userType, props]);

    useEffect(() => {
        if (router.route.indexOf('/vendors') === 0) {
            setIsVendorPage(true)
        } else {
            setIsVendorPage(false);
        }
    }, [router, userType]);

    useEffect(() => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        if (token) {
            (async () => {
                const res = await dispatch?.profile?.getProfile(config);
                document.cookie = `avatarSrc=${res.image}`;
            })();
        }
    }, [token]);

    const isCustomCart = useMemo(() => {
        return isCustomCartRoute(router.route);
    }, [router.route])

    const onCloseDrawer = () => {
        setVisible(false);
    }

    const logoutHandler = async () => {
        await dispatch.auth.logout();
        setAuthenticated(false);
        setUserType(null)
        router.push(routes.auth.login);
    }

    const UserDropdown = (
        <Menu className="shadow-lg">
            <Item className={'py-2 px-4'}>
                <Link href={userTypes[userType]?.profile}>
                    Show Profile
                </Link>
            </Item>
            <Item className={'py-2 px-4'} danger onClick={logoutHandler}>
                Logout
            </Item>
        </Menu>
    )

    const AdminProfile = () => (
        <div className="flex items-center space-x-3">
            <Link href={routes.admin.customerMessages.index}>
                <BellTwoTone style={{fontSize: 18}} twoToneColor="#1890FF"/>
            </Link>
            <Link href={routes.admin.profile.index}>
                <div className="cursor-pointer flex items-center space-x-2">
                    <SettingTwoTone/>
                    <span className="text-secondarey">
                        Profile Setting
                    </span>
                </div>
            </Link>
        </div>
    );

    const ExtraInfo = () => (
        <div className="flex flex-col items-center space-y-2">
            <div className="text-sm">Questions? Call or text</div>
            <div className="text-btn text-xl font-bold">548-883-2278</div>
            <div className="text-sm">Or</div>
            <button
                className="bg-btn text-white text-center py-2 rounded focus:outline-none cursor-pointer"
                style={{width: 179}}
                onClick={() => {
                    setVisible(false);
                    router.push("https://cart2curb.ca/#c-form");
                }}
            >
                Create a custom order
            </button>
            <button
                className="bg-btn text-white text-center py-2 rounded focus:outline-none cursor-pointer"
                style={{width: 179}}
                onClick={() => {
                    setVisible(false);
                    router.push(routes.homepage);
                }}
            >
                View stores near me
            </button>
        </div>
    );

    return (
        <div className="flex justify-between items-start h-full pt-10">
            <div className="flex flex-row items-center">
                <Link href={routes.homepage}>
                    <a>
                        <img src={'/images/logo.png'} alt={'Cart2Curb'} style={{height: 48, width: 60}}/>
                    </a>
                </Link>
                <div className="hidden md:flex items-center">
                    {!isAuthRoute.value && (
                        <>
                            {userType === 'vendor' ? (
                                <>
                                    <HeaderLink href={routes.vendors.index} hasPadding>
                                        Store
                                    </HeaderLink>
                                    <HeaderLink href={routes.vendors.orders.index} hasPadding>
                                        Orders
                                    </HeaderLink>
                                </>
                            ) : (router.route === '/stores') && (
                                <>
                                    <HeaderLink href={routes.homepage} hasPadding>
                                        Home
                                    </HeaderLink>
                                    <HeaderLink href={routes.stores.index} hasPadding>
                                        Stores
                                    </HeaderLink>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="hidden md:flex space-x-8 items-start">
                <div className="flex items-center">
                    {!isVendorPage ? (
                        <Link href={routes.cart.index}>
                            <Badge count={cart?.totalQuantity || 0} className={'cursor-pointer mr-4'}>
                                <HeaderNotificationIcon/>
                            </Badge>
                        </Link>
                    ) : (isCustomCart && (isAuthenticated || isAdmin)) ? (
                        <Link href={routes.vendors.customCart.index}>
                            <Badge count={customCart?.totalQuantity || 0} className={'cursor-pointer mr-4'}>
                                <HeaderNotificationIcon/>
                            </Badge>
                        </Link>
                    ) : null}
                    {isAuthenticated ? (
                        <>
                            {router.route !== routes.vendors.account.changePassword && (
                                <Dropdown overlay={UserDropdown} placement={"bottomRight"}>
                                    <div className="ml-14 cursor-pointer">
                                        <Avatar src={avatarImage} justImage/>
                                    </div>
                                </Dropdown>
                            )}
                        </>
                    ) : isAdmin ? <AdminProfile/> : (
                        <>
                            <Link href={isVendorPage ? userTypes['vendor'].login : userTypes['customer'].login}>
                                <Button type={'link'} className={'w-30 text-type ml-1 md:ml-6 lg:ml-8'}>Login</Button>
                            </Link>
                            <Link href={isVendorPage ? userTypes['vendor'].register : userTypes['customer'].register}>
                                <Button className={'w-30 text-type text-base ml-1 md:ml-3'}>Register</Button>
                            </Link>
                        </>
                    )}
                </div>
                <ExtraInfo/>
            </div>
            <div className="flex md:hidden">
                <Button style={{width: 50, height: 50}} className={'text-type text-xl'} type={'link'}
                        onClick={() => setVisible(true)}>
                    <MenuOutlined/>
                </Button>
            </div>

            <Drawer
                title="Menu"
                placement={'right'}
                closable={true}
                onClose={onCloseDrawer}
                visible={visible}
                key={'menu'}
                width={340}
            >
                <div className={'h-full w-full flex flex-col'}>

                    <div className="w-full flex-grow">
                        <Row gutter={[12, 32]}>
                            {!isAuthRoute.value && (
                                <>
                                    {userType ? (
                                        <>
                                            <Col xs={24}>
                                                <HeaderLink href={routes.vendors.index}>
                                                    My account
                                                </HeaderLink>
                                            </Col>
                                            <Col xs={24}>
                                                <HeaderLink href={routes.profile.orders}>
                                                    Orders
                                                </HeaderLink>
                                            </Col>
                                        </>
                                    ) : (router.route === '/stores') && (
                                        <>
                                            <Col xs={24}>
                                                <HeaderLink href={routes.homepage}>
                                                    Home
                                                </HeaderLink>
                                            </Col>
                                            <Col xs={24}>
                                                <HeaderLink href={routes.stores.index}>
                                                    Stores
                                                </HeaderLink>
                                            </Col>
                                        </>
                                    )}
                                </>
                            )}

                            <Col xs={24}>
                                {!isVendorPage ? (
                                    <Link href={routes.cart.index}>
                                        <div className="flex flex-row items-center justify-between">
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>
                                                Cart
                                            </a>
                                            <Badge count={cart?.totalQuantity || 0} className={'cursor-pointer'}>
                                                <HeaderNotificationIcon/>
                                            </Badge>
                                        </div>
                                    </Link>
                                ) : isCustomCart ? (
                                    <Link href={routes.vendors.customCart.index}>
                                        <div className="flex flex-row items-center justify-between">
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>
                                                Cart
                                            </a>

                                            <Badge count={customCart?.totalQuantity || 0} className={'cursor-pointer'}>
                                                <HeaderNotificationIcon/>
                                            </Badge>
                                        </div>
                                    </Link>
                                ) : null}
                            </Col>
                        </Row>
                        <div className="flex justify-end">
                            <ExtraInfo/>
                        </div>
                    </div>
                    <div className={'w-full'}>
                        {isAuthenticated ? (
                            <Row>
                                {router.route !== routes.vendors.account.changePassword && (
                                    <Col xs={24}>
                                        <div className="cursor-pointer">
                                            <Dropdown overlay={UserDropdown} placement={"bottomRight"}>
                                                <Avatar src={avatarImage} justImage/>
                                            </Dropdown>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        ) : (
                            <Row gutter={[12, 12]}>
                                <Col xs={24}>
                                    <Link href={isVendorPage ? userTypes['vendor'].login : userTypes['customer'].login}>
                                        <Button type={'link'} className={'w-full text-type'}>Login</Button>
                                    </Link>
                                </Col>
                                <Col xs={24}>
                                    <Link
                                        href={isVendorPage ? userTypes['vendor'].register : userTypes['customer'].register}>
                                        <Button className={'w-full text-type text-base'}>Register</Button>
                                    </Link>
                                </Col>
                            </Row>
                        )}
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default MainHeader;
