export default {
    auth: {
        login: '/login',
        forgetPassword: '/login/forget-password',
        register: {
            index: '/Account',
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
        edit: '/profile/view',
        changePassword: '/profile/change-password',
        addresses: {
            index: '/profile/addresses',
            add: '/profile/addresses/add'
        },
        payments: {
            index: '/profile/payment-info',
            new: '/profile/payment-info/Account',
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
                index: '/vendors/Account',
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
            add: '/vendors/products/Account'
        },
        categories: {
            index: '/vendors/dashboard?tab=categories',
            edit(number = '[number]') {
                return `/vendors/categories/edit/${number}`
            },
            add: '/vendors/categories/Account'
        },
        orders: '/vendors/orders',
        account: {
            index: '/vendors/view',
            changePassword: '/vendors/view/change-password',
            edit: '/vendors/view/view'
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
                index: '/admin/register',
            },
            account: {
                index: '/admin/view',
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
        profile: {
            index: '/admin/profile',
            changeEmail: '/admin/profile/change-email',
            changePassword: '/admin/profile/change-password',
        },
        customerMessages: {
            index: '/admin/customer-messages',
        },
        customers: {
            edit(customerId = '[customerId]') {
                return `/admin/customers/edit/${customerId}`
            },
            add: '/admin/customers/new'
        },
        vendors: {
            edit(vendorId = '[vendorId]') {
                return `/admin/vendors/edit/${vendorId}`
            },
            view(vendorId = '[vendorId]') {
                return `/admin/vendors/view/${vendorId}`
            },
            add: '/admin/vendors/add',
            pending: '/admin/vendors/pending'
        },
        drivers: {
            edit(driverId = '[driverId]') {
                return `/admin/drivers/edit/${driverId}`
            },
            view(driverId = '[driverId]') {
                return `/admin/drivers/view/${driverId}`
            },
            add: '/admin/drivers/new',
            pending: '/admin/drivers/pending'
        },
        products: {
            index: '/admin/store-details',
            edit(productId = '[productId]') {
                return `/admin/products/edit/${productId}`
            },
            view(productId = '[productId]') {
                return `/admin/products/${productId}`
            },
            add: '/admin/products/new'
        },
        services: {
            index: '/admin/store-details',
            edit(serviceId = '[serviceId]') {
                return `/admin/services/edit/${serviceId}`
            },
            view(serviceId = '[serviceId]') {
                return `/admin/services/${serviceId}`
            },
            add: '/admin/services/new'
        },
        categories: {
            index: '/admin/store-details',
            edit(categoryId = '[categoryId]') {
                return `/admin/categories/edit/${categoryId}`
            },
            add: '/admin/categories/new'
        },
        promo: {
            edit(promoId = '[promoId]') {
                return `/admin/promo-code/edit/${promoId}`
            },
            add: '/admin/promo-code/new'
        },
    },
    driver: {
        auth: {
            login: '/driver/login',
            forgetPassword: '/driver/login/forget-password',
            resetPassword: '/driver/login/reset-password',
            profile: '/driver/profile',
            register: {
                index: '/driver/register',
            },
            account: {
                index: '/driver/view',
            }
        },
        profile: {
          index: '/driver/profile',
          edit: '/driver/profile/edit',
          changePassword: '/driver/profile/changePassword'
        },
        deliveries: {
            available: '/driver/deliveries/available',
            current: '/driver/deliveries/current',
        },
    }
}