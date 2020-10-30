export default {
    auth: {
        login: '/login',
        forgetPassword: '/login/forget-password',
        register: {
            index: '/signup',
        },
        resetPassword: {
            index: '/login/reset-password',
        }
    },
    stores: {
        index: "/stores",
        single(vendor = '') {
            return `/stores/${vendor}`
        },
        product(vendor = '[vendor]', product = '[product]') {
            return `/stores/${vendor}/products/${product}`
        }
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
            new: '/profile/payment-info/new',
            edit(number = '[payment]') {
                return `/profile/payment-info/edit/${number}`
            },
        },
        orders: '/profile/orders'
    },
    about: '/about',
    contact: '/contact',
    vendors: {
        auth: {
            login: '/vendors/login',
            forgetPassword: '/vendors/login/forget-password',
            resetPassword: '/vendors/login/reset-password',
            register: {
                index: '/vendors/signup',
                submitted: '/vendors/signup/submitted'
            }
        },
        products: {
            index: '/vendors/dashboard',
            edit(number = '[number]') {
                return `/vendors/products/edit/${number}`
            },
            view(number = '[number]') {
                return `/vendors/products/${number}`
            },
            add: '/vendors/products/new'
        },
        categories: {
            index: '/vendors/dashboard',
            edit(number = '[number]') {
                return `/vendors/categories/edit/${number}`
            },
            view(number = '[number]') {
                return `/vendors/categories/${number}`
            },
            add: '/vendors/categories/new'
        },
        orders: '/vendors/orders',
        account: {
            index: '/vendors/account',
            changePassword: '/vendors/account/change-password',
            edit: '/vendors/account/edit'
        },
        index: '/vendors/dashboard'
    }
}