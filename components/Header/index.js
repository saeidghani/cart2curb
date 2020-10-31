import React, {useEffect, useState} from 'react';
import {Badge, Button, Drawer, Row, Col} from 'antd';
import Link from 'next/link'
import { MenuOutlined } from '@ant-design/icons';

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from "../../constants/routes";
import './styles.scss';
import {useAuthenticatedUserType, useIsAuthenticated, useIsAuthRoute} from "../../hooks/auth";
import {useRouter} from "next/router";
import Avatar from "../UI/Avatar";

const Header = props => {
    const [visible, setVisible] = useState(false);
    const [isVendorPage, setIsVendorPage] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const isAuthRoute = useIsAuthRoute();
    const router = useRouter();
    const userType = useAuthenticatedUserType()
    useEffect(() => {
        if(router.route.indexOf('/vendors') === 0 || userType === 'vendor') {
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
        <header className={'header layout__section'}>
            <div className="header__content">
                <div className="flex flex-row items-center">
                    <img src={'/images/Logo.png'} alt={'Cart2Curb'} style={{ height: 48, width: 130}} />
                    <div className="hidden md:flex items-center">
                        {!isAuthRoute.value && (
                            <>
                                <Link href={routes.homepage} className={'header__link text-purple'}>
                                    <a className={'text-header hover:text-red-500 cursor-pointer font-medium lg:ml-15.5 md:ml-10 sm:ml-8 ml-4'}>Home</a>
                                </Link>
                                <Link href={routes.stores.index} className={'header__link'}>
                                    <a className={'text-header hover:text-red-500 cursor-pointer font-medium lg:ml-15.5 md:ml-10 sm:ml-8 ml-4'}>Stores</a>
                                </Link>
                            </>
                        )}
                    </div>

                </div>
                <div className="hidden md:flex flex-row items-center">
                    {!isVendorPage && (
                        <Link href={routes.cart.index}>
                            <Badge count={5} className={'cursor-pointer'}>
                                <HeaderNotificationIcon />
                            </Badge>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <Link href={userType==='vendor' ? routes.vendors.account.index : routes.profile.index}>
                            <div className="ml-14">
                                <Avatar src={avatar} justImage/>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <Link href={routes.auth.login}>
                                <Button type={'link'} className={'w-30 text-type ml-1 md:ml-6 lg:ml-8'}>Login</Button>
                            </Link>
                            <Link href={routes.auth.register.index}>
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
                                    <Col xs={24}>
                                        <Link href={routes.homepage} className={'header__link text-purple'}>
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>Home</a>
                                        </Link>
                                    </Col>
                                    <Col xs={24}>
                                        <Link href={routes.stores.index} className={'header__link'}>
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>Stores</a>
                                        </Link>
                                    </Col>
                                </>
                            )}

                            <Col xs={24}>
                                {!isVendorPage && (
                                    <Link href={routes.cart.index}>
                                        <div className="flex flex-row items-center justify-between">
                                            <a className={'text-header hover:text-red-500 cursor-pointer font-medium'}>
                                                Cart
                                            </a>

                                            <Badge count={5} className={'cursor-pointer'}>
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
                                    <Col xs={24}>
                                        <Link href={userType==='vendor' ? routes.vendors.account.index : routes.profile.index}>
                                            <Avatar src={avatar} justImage/>
                                        </Link>
                                    </Col>
                                </Row>
                            ) : (
                                <Row gutter={[12, 12]}>
                                    <Col xs={24}>
                                        <Link href={routes.auth.login}>
                                            <Button type={'link'} className={'w-full text-type'}>Login</Button>
                                        </Link>
                                    </Col>
                                    <Col xs={24}>
                                        <Link href={routes.auth.register.index}>
                                            <Button className={'w-full text-type text-base'}>Register</Button>
                                        </Link>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </div>
                </Drawer>
            </div>
        </header>
    )
}

export default Header;