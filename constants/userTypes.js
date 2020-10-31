import routes from "./routes";

export default {
    customer: {
        login: routes.auth.login,
        profile: routes.profile.index,
    },
    vendor: {
        login: routes.vendors.auth.login,
        profile: routes.vendors.account.index,
    }
}