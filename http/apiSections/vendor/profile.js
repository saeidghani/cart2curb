import ApiInstance from "../../instance";

export default class VendorProfileApi extends ApiInstance {
    constructor() {
        super();

        this.methods = {
            profile: {
                get: this.profile,
                update: this.updateProfile,
            },
        }
    }

    /**
     * Get Profile details
     * @returns {Promise<*>}
     */
    profile(options = {}) {
        return this.get('vendor/profile', {}, options)
    }

    /**
     * Update Vendor profile information
     * @param body New Vendor Profile info
     * @param options
     * @returns {Promise<*>}
     */
    updateProfile(body, options = {}) {
        return this.put('vendor/profile', body, {}, options)
    }

}