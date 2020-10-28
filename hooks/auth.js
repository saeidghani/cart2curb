import {useCallback, useMemo} from 'react';
import {useSelector} from "react-redux";
import {message} from "antd";

import { isAuthRoute } from "../helpers";
import {useCurrentRoute} from "./currentRoute";
import {emitter} from "../helpers/emitter";
import routes from "../constants/routes";
import {useAuth} from "../providers/AuthProvider";

export const useIsAuthenticated = () => {
    const {isAuthenticated} = useAuth();

    return useMemo(() => {
        return isAuthenticated;
    }, [isAuthenticated])
}

export const useIsAuthRoute = () => {
    const route = useCurrentRoute();

    return useMemo(() => {
        return isAuthRoute(route)
    }, [route])
}

export const useRedirectToLogin = () => {
    const isAuthenticated = useIsAuthenticated();

    return useCallback(() => {
        if(!isAuthenticated) {
            emitter.emit('change-route', {
                path: routes.auth.login
            })
        }
    }, [isAuthenticated])
}

export const useRedirectAuthenticated = () => {
    const isAuthenticated = useIsAuthenticated();

    return useCallback(() => {
        if(isAuthenticated) {
            emitter.emit('change-route', {
                path: routes.homepage
            })
        }
    }, [isAuthenticated])

}