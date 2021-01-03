import routes from "./routes";

export default {
    customer: {
        login: routes.auth.login,
        profile: routes.profile.index,
        register: routes.auth.register.index
    },
    vendor: {
        login: routes.vendors.auth.login,
        profile: routes.vendors.account.index,
        register: routes.vendors.auth.register.index
    },
    admin: {
        login: routes.admin.auth.login,
    }
}