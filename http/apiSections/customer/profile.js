import ApiInstance from "../../instance";

export default class CustomerProfileApi extends ApiInstance {
    constructor() {
        super();

        this.methods = {
            profile: {
                get: this.profile,
                update: this.updateProfile,
            },
            addresses: {
                get: this.addresses,
                add: this.addAddress,
                remove: this.deleteAddress
            },
            payments: {
                get: this.payments,
                add: this.addPayment,
                remove: this.deletePayment
            },
            socialMedias: {
                get: this.socialMedias,
                add: this.addSocialMedia,
                remove: this.deleteSocialMedia
            },
            orders: {
                get: this.orders,
                remove: this.deleteOrder
            }
        }
    }

    /**
     * Get Profile details
     * @returns {Promise<*>}
     */
    profile(options = {}) {
        return this.get('customer/profile', {}, options)
    }

    /**
     * Update Customer profile information
     * @param body New Customer Profile info
     * @param options
     * @returns {Promise<*>}
     */
    updateProfile(body, options = {}) {
        return this.put('customer/profile', body, {}, options)
    }


    /**
     * Get Customer addresses
     * @returns {Promise<*>}
     */
    addresses(options = {}) {
        return this.get('customer/profile/addresses', {}, options)
    }


    /**
     * Add New Address
     * @param body New Address Info
     * @param options
     * @returns {Promise<*>}
     */
    addAddress(body, options = {}) {
        return this.post('customer/profile/addresses', body, {}, options)
    }

    /**
     * Delete Address
     * @param body
     * @param options
     * @returns {Promise<*>}
     */
    deleteAddress(body, options = {}) {
        return this.delete(`customer/profile/addresses/${body.id}`, options)
    }


    /**
     * Get Customer Payment Infos
     * @returns {Promise<*>}
     */
    payments(options = {}) {
        return this.get(`customer/profile/payments`, {}, options)
    }

    /**
     * Add New Payment credential
     * @returns {Promise<*>}
     */
    addPayment(body, option = {}) {
        return this.post(`customer/profile/payments`, body, {}, option)
    }

    /**
     * Delete Payment info
     * @returns {Promise<*>}
     */
    deletePayment(body, options = {}) {
        return this.delete(`customer/profile/payments/${body.id}`, options)
    }

    /**
     * Get Customer social medias
     * @returns {Promise<*>}
     */
    socialMedias(...request) {
        return this.get(`customer/profile/socialmedias`, ...request)
    }

    /**
     * Add New Social media link
     * @returns {Promise<*>}
     */
    addSocialMedia(body, ...request) {
        return this.post(`customer/profile/socialmedias`, body, ...request)
    }

    /**
     * Delete Social media link
     * @returns {Promise<*>}
     */
    deleteSocialMedia(id, request) {
        return this.delete(`customer/profile/socialmedias/${id}`, request)
    }


    /**
     * Fetch Customer orders info with pagination
     * @returns {Promise<*>}
     * @param body
     * @param options
     */
    orders(body, options = {}) {
        return this.get(`customer/profile/orders/`, body, options)
    }

    /**
     * Delete Order or cancel it
     * @param id
     * @param options
     * @returns {Promise<*>}
     */
    deleteOrder(id, options = {}) {
        return this.delete(`customer/profile/orders/${id}`, options)
    }

}