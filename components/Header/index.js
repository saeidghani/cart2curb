import React, {useEffect, useState} from 'react';
import { Badge, Button } from 'antd';
import Link from 'next/link'

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from "../../constants/routes";
import './styles.scss';
import {useAuthenticatedUserType, useIsAuthenticated, useIsAuthRoute} from "../../hooks/auth";
import {useRouter} from "next/router";

const Header = props => {
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

    return (
        <header className={'header layout__section'}>
            <div className="header__content">
                <div className="flex flex-row items-center">
                    <img src={'/images/Logo.png'} alt={'Cart2Curb'} style={{ height: 48}} />
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
                <div className="flex flex-row items-center">
                    {!isVendorPage && (
                        <Link href={routes.cart.index}>
                            <Badge count={5} className={'cursor-pointer'}>
                                <HeaderNotificationIcon />
                            </Badge>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <Link href={userType==='vendor' ? routes.vendors.account.index : routes.profile.index}>
                            <img src="/images/profile.png" alt="profile" className="ml-14 rounded-full cursor-pointer" />
                        </Link>
                    ) : (
                        <>
                            <Link href={routes.auth.login}>
                                <Button type={'link'} className={'w-30 text-type ml-3 md:ml-6 lg:ml-8'}>Login</Button>
                            </Link>
                            <Link href={routes.auth.register.index}>
                                <Button className={'w-30 text-type text-base ml-1 md:ml-3'}>Register</Button>
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </header>
    )
}

export default Header;