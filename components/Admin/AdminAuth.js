import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";

import routes from '../../constants/routes';

const AdminAuth = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) setIsAuth(true);
        if (!token) router.push({pathname:routes.admin.auth.login, query: {prevPath: window.location.pathname}});
    }, []);

    if (!isAuth) return null;
    return (
        <>
            {children}
        </>
    )
};

export default AdminAuth;