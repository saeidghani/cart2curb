import { useIsAuthenticated } from '../../providers/AuthProvider';
import withConditionalRedirect from './withConditionalRedirect';
import routes from "../../constants/routes";

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
 */
export default function withAuth(WrappedComponent, location= routes.auth.login) {
    return withConditionalRedirect({
        WrappedComponent,
        location,
        clientCondition: function withAuthClientCondition() {
            return !useIsAuthenticated();
        },
        serverCondition: function withAuthServerCondition(ctx) {
            return !ctx.req?.cookies.session;
        }
    });
}