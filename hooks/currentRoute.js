import { useMemo } from 'react';
import { useRouter } from "next/router";

export const useCurrentRoute = () => {
    const router = useRouter();

    return useMemo(() => {
        return router.route;
    }, [router])
}

export const useIsCurrentRoute = (route) => {
    const currentRoute = useCurrentRoute();

    return useMemo(() => {
        return currentRoute === route
    }, [currentRoute, route])
}