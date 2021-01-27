import {message} from "antd";
import {emitter} from "../../../helpers/emitter";
import routes from "../../../constants/routes";
import api from '../../../http/Api';

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const driverAuth = {
    state: {
        isLoggedIn: false,
        token: null,
        resetToken: null,
        isReseted: false,
        resetAttempt: 0,
    },
    reducers: {
        authenticate: (state, payload) => {
            window.localStorage.setItem("driver_token", payload?.token);
            state.isLoggedIn = true;
            state.token = payload?.token;
        },
        logoutSync: (state) => {
            window.localStorage.setItem("driver_token", "");

            state.isLoggedIn = false;
            state.token = null;
        },
        setResetToken: (state, payload) => {
            state.resetToken = payload?.token;
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
                const res = await api?.driver?.auth?.login(body);

                if(res?.data?.success) {
                    this.authenticate({
                        token: res?.data?.data?.token
                    });
                    message.success('You Logged in successfully!');
                    return res?.data;
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
            this.logoutSync();
        },
        async register(body) {
            try {
                const res = await api.driver.auth.register(body);
                const data = res?.data;
                if(data?.success) {
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
                const res = await api.driver.auth.forgetPassword(body);
                if(res?.data?.success) {
                    const msg = 'Forgot Your Password?\n' +
                        'If a view is associated with the email you have entered, you will receive an email containing instructions and a link to reset your password.'
                    message.success(msg);
                }
                this.destroyResetToken();
            } catch(e) {
                console.log(e);
                message.error('Something went wrong', 5);
            }
        },
        async resetPassword(body) {
            try {
                const res = await api.driver.auth.resetPassword(body);
                if(res?.data?.success) {
                    this.setResetToken({ token: body?.token });
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
        async changePassword({body, token}) {
            try {
                const res = await api.driver.auth.changePassword(body, setOptions(token));
                if(res?.data?.success) {
                    message.success('Password changed successfully')
                    emitter.emit('change-route', {
                        path: routes?.driver?.auth.profile
                    })
                    return true;
                }
            } catch(e) {
                message.error('Something went wrong', 5);
            }
        }
    })
}