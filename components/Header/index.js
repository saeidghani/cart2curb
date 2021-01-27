import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import './styles.less';
import {useAuthenticatedUserType} from '../../hooks/auth';
import MainHeader from './MainHeader';
import AdminHeader from './AdminHeader';
import DriverHeader from './DriverHeader';

const Header = props => {
    const [platformType, setPlatformType] = useState('');
    const userType = useAuthenticatedUserType();
    const router = useRouter();

    useEffect(() => {
        if (router.route.indexOf('/admin') === 0) {
            setPlatformType('admin');
        } else if (router.route.indexOf('/driver') === 0) {
            setPlatformType('driver');
        } else {
            setPlatformType('other');
        }
    }, [router, userType]);

    return (
        <header className={'header layout__section'}>
            {platformType === 'admin' ? <AdminHeader /> : platformType === 'driver' ? <DriverHeader/> : <MainHeader {...props} />}
        </header>
    );
};

export default Header;