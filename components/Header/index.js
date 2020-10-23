import React from 'react';
import { Badge, Layout } from 'antd';
import Link from 'next/link'

import {HeaderLogoIcon, HeaderNotificationIcon} from '../icons';
import routes from "../../constants/routes";
import './styles.scss';

const { Header: AntHeader } = Layout;

// @todo: add authentication logics to state and here
const Header = props => {
    return (
        <header className={'header layout__section'}>
            <div className="header__content">
                <div className="flex flex-row items-center">
                    <HeaderLogoIcon/>
                    <Link href={routes.homepage} className={'header__link text-purple'}>
                        <a className={'text-header hover:text-red-500 cursor-pointer font-medium lg:ml-15.5 md:ml-10 sm:ml-8 ml-4'}>Home</a>
                    </Link>
                    <Link href={routes.vendors.index} className={'header__link'}>
                        <a className={'text-header hover:text-red-500 cursor-pointer font-medium lg:ml-15.5 md:ml-10 sm:ml-8 ml-4'}>Stores</a>
                    </Link>
                </div>
                <div className="flex flex-row items-center">
                    <Link href={routes.cart.index}>
                            <Badge count={5} className={'cursor-pointer'}>
                                <HeaderNotificationIcon />
                            </Badge>
                    </Link>
                    <Link href={routes.profile.index}>
                        <img src="/images/profile.png" alt="profile" className="ml-10 rounded-full cursor-pointer" />
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header;