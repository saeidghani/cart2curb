import React, {useEffect, useState} from 'react';
import routes from "../../constants/routes";
import Link from "next/link";
import {useRouter} from "next/router";
import {useAuthenticatedUserType} from "../../hooks/auth";
import MainFooter from './MainFooter';
import DriverFooter from './DriverFooter';

const Footer = props => {
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
        <div>
            <MainFooter/>
        </div>
    )
}

export default Footer;
