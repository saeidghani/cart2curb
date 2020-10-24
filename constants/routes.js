export default {
    auth: {
        login: '/login',
        forgetPassword: '/login/forget-password',
        register: {
            index: '/signup',
            submitted: '/signup/submitted',
            accountInfo: '/signup/info'
        },
        resetPassword: '/login/reset-password'
    },
    stores: {
        index: "/stores"
    },
    homepage: '/',
    cart: {
        index: '/cart',
        checkout: '/cart/checkout',
        guest: {
            index: '/cart/guest',
            checkout: '/cart/guest/checkout'
        },
        delivery: '/cart/delivery',
        invoice: {
            index: '/cart/delivery/invoice',
            result: "/cart/delivery/invoice/result"
        }
    },
    profile: {
        index: '/profile',
        edit: '/profile/edit',
        changePassword: '/profile/change-password',
        addresses: {
            index: '/profile/addresses',
            add: '/profile/addresses/add'
        },
        payments: {
            index: '/profile/payment-info',
            new: '/profile/payment-info/new'
        },
        orders: '/profile/orders'
    },
    about: '/about',
    contact: '/contact',
    vendors: {
        auth: {
            login: '/vendors/login',
            forgetPassword: '/vendors/login/forget-password',
            resetPassword: '/vendors/login/reset-password'
        },
    }
}