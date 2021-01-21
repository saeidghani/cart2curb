import ApiInstance from "../../instance";

export default class VendorAuthApi extends ApiInstance {
    constructor() {
        super();

        this.methods = {
            login: this.login,
            register: this.register,
            forgetPassword: this.forgetPassword,
            resetPassword: this.resetPassword,
            changePassword: this.changePassword
        }
    }

    /**
     * Vendor Login Method
     * @param username
     * @param password
     * @param options
     * @returns {Promise} Token
     */
    login({username, password}, options = {}) {
        return this.post('vendor/auth/login', {
            username,
            password,
        }, {}, options)
    }

    /**
     * Vendor Register Method
     * @param body
     * @param options
     * @returns {Promise} Token
     */
    register(body, options = {}) {
        return this.post('vendor/auth/register', body, {}, options)
    }

    /**
     * Vendor Forget Password
     * @param email
     * @returns {Promise} Void
     */
    forgetPassword({ email }) {
        return this.post('vendor/auth/forgotpassword', {
            email
        })
    }

    /**
     * Vendor reset password
     * @param token Token that was generated in serverside
     * @param newPassword New Password that user selected
     * @returns {Promise<*>}
     */
    resetPassword({ token, newPassword }) {
        return this.put('vendor/auth/resetpassword', {
            newPassword
        }, { token })
    }

    /**
     * Vendor change password
     * @param currentPassword Vendor current password
     * @param newPassword Vendor new selected password
     * @param options
     * @returns {Promise<*>}
     */
    changePassword({ currentPassword, newPassword }, options = {}) {
        return this.put('/vendor/auth/changepassword', {
            currentPassword,
            newPassword
        }, {}, options)
    }

}