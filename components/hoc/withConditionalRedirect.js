import React from 'react';
import { useRouter } from 'next/router';
import userTypes from "../../constants/userTypes";
import {useAuthenticatedUserType} from "../../hooks/auth";

function isBrowser() {
    return typeof window !== 'undefined';
}

/**
 * Support conditional redirecting, both server-side and client-side.
 *
 * Client-side, we can use next/router. But that doesn't exist on the server.
 * So on the server we must do an HTTP redirect. This component handles
 * the logic to detect whether on the server and client and redirect
 * appropriately.
 *
 * @param WrappedComponent The component that this functionality
 * will be added to.
 * @param clientCondition A function that returns a boolean representing
 * whether to perform the redirect. It will always be called, even on
 * the server. This is necessary so that it can have hooks in it (since
 * can't be inside conditionals and must always be called).
 * @param serverCondition A function that returns a boolean representing
 * whether to perform the redirect. It is only called on the server. It
 * accepts a Next page context as a parameter so that the request can
 * be examined and the response can be changed.
 * @param location The location to redirect to.
 * @param pageType
 * @param userType
 */
export default function withConditionalRedirect({
    WrappedComponent,
    clientCondition,
    serverCondition,
    location,
    pageType,
    userType
}) {
    const WithConditionalRedirectWrapper = props => {
        const router = useRouter();
        const redirectCondition = clientCondition();
        if (isBrowser() && redirectCondition) {
            router.push(userTypes[pageType][location]);
        }
        return <WrappedComponent {...props} />;
    };

    WithConditionalRedirectWrapper.getInitialProps = async (ctx) => {
        if (!isBrowser() && ctx.res) {
            const type = userType(ctx);
            if(type && type !== pageType) {
                ctx.res.writeHead(302, { Location: userTypes[type]['profile'] });
                ctx.res.end();
            }

            if (serverCondition(ctx)) {
                ctx.res.writeHead(302, { Location: userTypes[pageType][location] });
                ctx.res.end();
            }

        }

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps };
    };

    return WithConditionalRedirectWrapper;
}