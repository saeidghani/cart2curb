import ApiInstance from "../../instance";

export default class DriverAuthApi extends ApiInstance {
    constructor() {
        super();
    };

    login(body, options = {}) {
        return this.post(`driver/auth/login`, body, {}, options);
    }

    logout() {
        return this.post(`driver/auth/logout`, {}, {}, {});
    }

    register(body, options = {}) {
        return this.post('driver/auth/register', body, {}, options);
    }

    forgetPassword(body, options = {}) {
        return this.post('driver/auth/forgotPassword', body, {}, options);
    }

    resetPassword(body, options = {}) {
        return this.post('driver/auth/resetPassword', body, {}, options);
    }

    changePassword(body, options = {}) {
        return this.put('driver/auth/changepassword', body, {}, options);
    }
}