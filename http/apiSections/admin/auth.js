import ApiInstance from "../../instance";

export default class AdminAuthApi extends ApiInstance {
    constructor() {
        super();
    };

    login(body, options = {}) {
        return this.post(`admin/auth/login`, body, {}, options);
    }

    logout() {
        return this.post(`admin/auth/logout`, {}, {}, {});
    }

    register(body, options = {}) {
        return this.post('admin/auth/register', body, {}, options);
    }

    forgetPassword(body, options = {}) {
        return this.post('admin/auth/forgotPassword', body, {}, options);
    }

    resetPassword(body, options = {}) {
        return this.put('admin/auth/resetPassword', body, {}, options);
    }

    changePassword(body, options = {}) {
        return this.post('admin/auth/changePassword', body, {}, options);
    }
}