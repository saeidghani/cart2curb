import { useIsAuthenticated } from '../../providers/AuthProvider';
import withConditionalRedirect from './withConditionalRedirect';
import routes from "../../constants/routes";

/**
 * Require the user to be unauthenticated in order to render the component.
 * If the user is authenticated, forward to the given URL.
 */
export default function withoutAuth(WrappedComponent, pageType = 'customer', withoutClientSide = false) {
    return withConditionalRedirect({
        WrappedComponent,
        location: 'profile',
        clientCondition: function withoutAuthClientCondition() {
            return useIsAuthenticated() && !withoutClientSide;
        },
        serverCondition: function withoutAuthServerCondition(ctx) {
            return !!ctx.req?.cookies.token;
        },
        pageType,
        userType: function withUserType(ctx) {
            return ctx.req?.cookies.type;
        },
    });
}