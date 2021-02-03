import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useSelector} from "react-redux";

import routes from '../../constants/routes';
import Avatar from '../UI/Avatar';
import './styles.less';
import ProfileDropdown from '../Driver/ProfileDropdown';

const DriverHeader = props => {
    const router = useRouter();
    const {pathname} = router;
    const profile = useSelector(state => state?.driverProfile?.profile);

    return (
        <div className="header__content">
            <div className="flex flex-row items-center">
                <Link href={routes.homepage}>
                    <a>
                        <img src='/images/logo.png' alt='Cart2Curb' style={{height: 48, width: 60}}/>
                    </a>
                </Link>
            </div>
            <div className="">
                {(pathname.includes('driver/login') || pathname.includes('driver/register')) ? <>

                </> : <ProfileDropdown name={profile?.name} avatarSrc={profile?.image}/>}
            </div>
        </div>
    );
};

export default DriverHeader;
