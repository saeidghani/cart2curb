import React from 'react';
import {Button} from 'antd';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {BellTwoTone, SettingTwoTone} from '@ant-design/icons';

import routes from '../../constants/routes';
import './styles.less';

const AdminHeader = props => {
    const adminImage = useSelector(state => state?.adminProfile?.profile?.image);
    const router = useRouter();
    const {pathname} = router;

    const getLinkClassName = (path) => `hover:text-primary-500 cursor-pointer font-medium pb-2 lg:ml-15.5 md:ml-10 sm:ml-8 ml-4 ${pathname.includes(path) ? 'text-secondarey border-b-2 border-solid border-secondarey' : 'text-header border-b-2 border-solid border-transparent'}`;

    const AdminNav = () => (
        <>
            {!pathname.includes('admin/login') ? (<>
                    <Link href={routes.admin.deliveries.index} className={'header__link'}>
                        <a className={getLinkClassName('deliveries')}>Deliveries</a>
                    </Link>
                    <Link href={routes.admin.orders.index} className={'header__link'}>
                        <a className={getLinkClassName('orders')}>Orders</a>
                    </Link>
                    <Link href={routes.admin.stores.index} className={'header__link'}>
                        <a className={getLinkClassName('stores')}>Stores</a>
                    </Link>
                    <Link href={routes.admin.users.index} className={'header__link'}>
                        <a className={getLinkClassName('users')}>Users</a>
                    </Link>
                </>
            ) : (<span></span>)}
        </>
    );

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

    return (
        <div className="header__content">
            <div className="flex flex-row items-center">
                <Link href={routes.homepage}>
                    <a>
                        <img src='/images/logo.png' alt='Cart2Curb' style={{height: 48, width: 60}}/>
                    </a>
                </Link>
                <AdminNav/>
            </div>
            <div className="hidden md:flex flex-row items-center">
                {(!pathname.includes('admin/login') && !pathname.includes('admin/register')) && <AdminProfile/>}
            </div>
        </div>
    );
};

export default AdminHeader;
