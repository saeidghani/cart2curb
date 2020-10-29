import { useIsAuthenticated } from '../../providers/AuthProvider';
import withConditionalRedirect from './withConditionalRedirect';
import routes from "../../constants/routes";

/**
 * Require the user to be unauthenticated in order to render the component.
 * If the user is authenticated, forward to the given URL.
 */
export default function withoutAuth(WrappedComponent, location= routes.homepage) {
    return withConditionalRedirect({
        WrappedComponent,
        location,
        clientCondition: function withoutAuthClientCondition() {
            return useIsAuthenticated();
        },
        serverCondition: function withoutAuthServerCondition(ctx) {
            return !!ctx.req?.cookies.token;
        }
    });
}