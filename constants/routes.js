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
            invoice: '/cart/guest/invoice',
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
        },
        orders: '/profile/orders'
    },
    about: '/about',
    contact: '/contact',
    faq: '/faq',
    vendors: {
        auth: {
            login: '/vendors/login',
            forgetPassword: '/vendors/login/forget-password',
            resetPassword: '/vendors/login/reset-password',
            register: {
                index: '/vendors/signup',
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
            index: '/vendors/dashboard?tab=categories',
            edit(number = '[number]') {
                return `/vendors/categories/edit/${number}`
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
    },
    admin: {
        auth: {
            login: '/admin/login',
            forgetPassword: '/admin/login/forget-password',
            resetPassword: '/admin/login/reset-password',
            profile: '/admin/profile',
            register: {
                index: '/admin/signup',
            },
            account: {
                index: '/admin/account',
            }
        },
        deliveries: {
            index: '/admin/deliveries'
        },
        orders: {
            index: '/admin/orders'
        },
        stores: {
            index: '/admin/stores',
            storeDetails: '/admin/stores/store-details'
        },
        users: {
            index: '/admin/users'
        },
        products: {
            index: '/admin/store-details?tab=products',
            edit(productId = '[productId]') {
                return `/admin/products/edit/${productId}`
            },
            view(number = '[number]') {
                return `/admin/products/${number}`
            },
            add: '/admin/products/new'
        },
        categories: {
            index: '/admin/store-details',
            edit(number = '[number]') {
                return `/admin/categories/edit/${number}`
            },
            add: '/admin/categories/new'
        },
        vendors: {
            signup: '/admin/signup'
        }
    }
}