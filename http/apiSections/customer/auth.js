import ApiInstance from "../../instance";

export default class CustomerAuthApi extends ApiInstance {
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
     * Customer Login Method
     * @param username
     * @param password
     * @param options
     * @returns {Promise} Token
     */
    login({username, password}, options = {}) {
        return this.post('customer/auth/login', {
                username,
                password,
            }, {}, options)
    }

    /**
     * Customer Register Method
     * @param body
     * @param options
     * @returns {Promise} Token
     */
    register(body, options = {}) {
        return this.post('customer/auth/register', body, {}, options)
    }

    /**
     * Customer Forget Password
     * @param email
     * @returns {Promise} Void
     */
    forgetPassword({ email }) {
        return this.post('customer/auth/forgotpassword', {
                email
            })
    }

    /**
     * Customer reset password
     * @param token Token that was generated in serverside
     * @param newPassword New Password that user selected
     * @returns {Promise<*>}
     */
    resetPassword({ token, newPassword }) {
        return this.put('customer/auth/resetpassword', {
                newPassword
            }, { token })
    }

    /**
     * Customer change password
     * @param currentPassword Customer current password
     * @param newPassword Customer Account selected password
     * @param options
     * @returns {Promise<*>}
     */
    changePassword({ currentPassword, newPassword }, options = {}) {
        return this.put('/customer/auth/changepassword', {
                currentPassword,
                newPassword
            }, {}, options)
    }

}