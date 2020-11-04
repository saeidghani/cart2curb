import {api} from '../../../lib/api';
import {message} from "antd";
import {emitter} from "../../../helpers/emitter";
import routes from "../../../constants/routes";

export const vendorAuth = {
    state: {
        isLoggedIn: false,
        token: null,
        resetToken: null,
        isReseted: false,
        resetAttempt: 0,
    },
    reducers: {
        authenticate: (state, payload) => {
            window.localStorage.setItem("jwt_token", payload.token);
            state.isLoggedIn = true;
            state.token = payload.token;
        },
        logoutSync: (state) => {
            window.localStorage.setItem("jwt_token", "");

            state.isLoggedIn = false;
            state.token = null;
        },
        setResetToken: (state, payload) => {
            state.resetToken = payload.token;
            state.isReseted = true;
        },
        destroyResetToken: (state) => {
            state.resetToken = null;
            state.isReseted = false;
            state.resetAttempt = 0;
        },
        increaseAttempt: (state) => {
            state.resetAttempt++;
        }
    },
    effects: dispatch => ({
        async login(body) {
            try {
                const res = await api.post('vendor/auth/login', body);
                if(res.data.success) {
                    dispatch.vendorAuth.authenticate({
                        token: res.data.data.token
                    });
                    message.success('You Logged in successfully!');
                    return true;
                } else {
                    message.error('Username Or Password is wrong', 5);
                }

                return false;
            } catch(e) {
                message.error('Username Or Password is wrong', 5);
                return false;
            }
        },
        async logout() {
            dispatch.vendorAuth.logoutSync();
            await api.post('vendor/auth/logout', {})
            return true;
        },
        async register(body) {
            try {
                const res = await api.post('vendor/auth/register', body);
                const data = res.data;
                if(data.success) {
                    message.success('Your Request was Sent!');
                    return true;
                } else {
                    message.error('Something went wrong', 5);
                }
                return false;
            } catch(e) {
                console.log(e);
                message.error('Something went wrong', 5);

                return false;
            }

        },
        async forgetPassword(body) {
            try {
                const res = await api.post('vendor/auth/forgetPassword', body);
                if(res.data.success) {
                    message.success('Reset Link was sent to your email');
                }
                dispatch.vendorAuth.destroyResetToken()
            } catch(e) {
                console.log(e);
                message.error('Something went wrong', 5);
            }
        },
        async resetPassword(body) {
            try {
                const res = await api.post('vendor/auth/resetPassword', body);
                if(res.data.success) {
                    dispatch.vendorAuth.setResetToken({ token: body.token });
                    message.success('Your Password was changed!');
                    return true;
                } else {
                    message.error('Your Token is not valid or expired', 5);
                    return false;
                }

            } catch(e) {
                message.error('Your Token is not valid or expired', 5);
                return false;
            }
        },
        async changePassword(body) {
            try {
                const res = await api.post('vendor/auth/changePassword', body);
                if(res.data.success) {
                    message.success('Password changed successfully')
                    emitter.emit('change-route', {
                        path: routes.vendors.account.index,
                    })
                    return true;
                }
            } catch(e) {
                message.error('Something went wrong', 5);
            }
        }
    })
}