import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";

import routes from '../../constants/routes';
import {useSelector} from "react-redux";

const DriverAuth = ({children}) => {
    const token = useSelector(state => state?.driverAuth?.token);
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
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