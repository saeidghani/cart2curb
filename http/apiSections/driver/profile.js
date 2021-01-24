import ApiInstance from "../../instance";

export default class AdminProfileApi extends ApiInstance {
    constructor() {
        super();
    };

    getProfile(options = {}) {
        return this.get('driver/profile', {}, options);
    }

    editProfile(body, options = {}) {
        return this.put('driver/profile', body, {}, options);
    }

    addProfile(body, options = {}) {
        return this.post('driver/profile/registration-token', body, {}, options);
    }

    deleteProfile(token, options = {}) {
        return this.delete(`driver/profile/registration-token/${token}`, options);
    }

}