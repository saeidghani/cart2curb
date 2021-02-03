import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";

import routes from '../../constants/routes';
import {useSelector, useDispatch} from "react-redux";

const DriverAuth = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const token = useSelector(state => state?.driverAuth?.token);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('driver_token');
        if (token) {
            setIsAuth(true);
            dispatch?.driverAuth?.authenticate({token});
        } else {
            router.push({pathname:routes.driver.auth.login, query: {prevPath: window.location.pathname}});
        }
    }, []);

    useEffect(() => {
        if (token) {
            dispatch?.driverProfile?.getProfile({token});
        }
    }, [token])

    if (!isAuth) return null;
    return (
        <>
            {children}
        </>
    )
};

export default DriverAuth;