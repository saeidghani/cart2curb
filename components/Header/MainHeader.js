import React, {useEffect, useState} from 'react';
import {Badge, Button, Drawer, Row, Col} from 'antd';
import Link from 'next/link'
import { MenuOutlined } from '@ant-design/icons';

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from "../../constants/routes";
import './styles.less';
import {useAuthenticatedUserType, useIsAuthenticated, useIsAuthRoute} from "../../hooks/auth";
import {useRouter} from "next/router";
import Avatar from "../UI/Avatar";
import {useDispatch, useSelector} from "react-redux";
import userTypes from "../../constants/userTypes";
import HeaderLink from "./HeaderLink";

const MainHeader = props => {
    const [visible, setVisible] = useState(false);
    const [avatarImage, setAvatarImage] = useState('');
    const [isVendorPage, setIsVendorPage] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const isAuthRoute = useIsAuthRoute();
    const router = useRouter();
    const userType = useAuthenticatedUserType()
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const cart = useSelector(state => state.cart.cart);
    const cartChanges = useSelector(state => state.cart.cartChanges);

    useEffect(() => {
        dispatch.cart.getClientCart();
    }, [token, cartChanges])

    useEffect(() => {
        if(userType) {
            if(props.avatar) {
                setAvatarImage(props.avatar);
            }
        } else {
            setAvatarImage('');
        }

    }, [userType, props])

    useEffect(() => {
        if(router.route.indexOf('/vendors') === 0) {
            setIsVendorPage(true)
        } else {
            setIsVendorPage(false);
        }
    }, [router, userType])

    const onCloseDrawer = () => {
        setVisible(false);
    }

    const avatar = props.avatar || '';
    return (
        <div className="header__content">
            <div className="flex flex-row items-center">
                <Link href={routes.homepage}>
                    <a>
                        <img src={'/images/Logo.svg'} alt={'Cart2Curb'} style={{ height: 48, width: 60}} />
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
                                    <HeaderLink href={routes.vendors.orders} hasPadding>
                                        Orders
                                    </HeaderLink>
                                </>
                            ): (
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
            <div className="hidden md:flex flex-row items-center">
                {!isVendorPage && (
                    <Link href={routes.cart.index}>
                        <Badge count={cart.totalQuantity || 0} className={'cursor-pointer'}>
                            <HeaderNotificationIcon />
                        </Badge>
                    </Link>
                )}
                {isAuthenticated ? (
                    <>
                        {router.route !== routes.vendors.account.changePassword && (
                            <Link href={userType==='vendor' ? routes.vendors.account.index : routes.profile.index}>
                                <div className="ml-14 cursor-pointer">
                                    <Avatar src={avatarImage} justImage/>
                                </div>
                            </Link>
                        )}
                    </>
                ) : (
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
            <div className="flex md:hidden">
                <Button style={{ width: 50, height: 50}} className={'text-type text-xl'} type={'link'} onClick={() => setVisible(true)}>
                    <MenuOutlined />
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
                                                    Store
                                                </HeaderLink>
                                            </Col>
                                            <Col xs={24}>
                                                <HeaderLink href={routes.vendors.orders}>
                                                    Orders
                                                </HeaderLink>
                                            </Col>
                                        </>
                                    ): (
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
                                {!isVendorPage && (
                                    <Link href={routes.cart.index}>
                                        <div className="flex flex-row items-center justify-between">
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>
                                                Cart
                                            </a>

                                            <Badge count={cart.totalQuantity || 0} className={'cursor-pointer'}>
                                                <HeaderNotificationIcon />
                                            </Badge>
                                        </div>
                                    </Link>
                                )}
                            </Col>
                        </Row>
                    </div>
                    <div className={'w-full'}>
                        {isAuthenticated ? (
                            <Row>
                                {router.route !== routes.vendors.account.changePassword && (
                                    <Col xs={24}>
                                        <Link href={userType==='vendor' ? routes.vendors.account.index : routes.profile.index}>
                                            <div className="cursor-pointer">
                                                <Avatar src={avatarImage} justImage/>
                                            </div>
                                        </Link>
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
                                    <Link href={isVendorPage ? userTypes['vendor'].register : userTypes['customer'].register}>
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
