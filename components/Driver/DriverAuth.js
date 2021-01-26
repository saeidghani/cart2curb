import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";

import routes from '../../constants/routes';

const DriverAuth = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('driver_token');
        if (token) setIsAuth(true);
        if (!token) router.push({pathname:routes.driver.auth.login, query: {prevPath: window.location.pathname}});
    }, []);

    if (!isAuth) return null;
    return (
        <>
            {children}
        </>
    )
};

export default DriverAuth;