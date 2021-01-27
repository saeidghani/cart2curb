import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useSelector} from "react-redux";

import routes from '../../constants/routes';
import Avatar from '../UI/Avatar';
import './styles.less';

const DriverHeader = props => {
    const router = useRouter();
    const {pathname} = router;
    const profile = useSelector(state => state?.driverProfile?.profile);

    return (
        <div className="header__content">
            <div className="flex flex-row items-center">
                <Link href={routes.homepage}>
                    <a>
                        <img src='/images/Logo.png' alt='Cart2Curb' style={{height: 48, width: 130}}/>
                    </a>
                </Link>
            </div>
            <div className="">
                {(pathname.includes('driver/login') || pathname.includes('driver/register')) ? <>

                </> : <div className="flex items-center space-x-3">
                    <Link href={routes.driver.profile.index}>
                        <div className="cursor-pointer flex items-center space-x-2">
                            <Avatar src={profile?.image} justImage/>
                        </div>
                    </Link>
                </div>}
            </div>
        </div>
    );
};

export default DriverHeader;
