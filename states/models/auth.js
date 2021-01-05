import {api} from '../../lib/api';
import axios from 'axios';
import {message} from "antd";
import {emitter} from "../../helpers/emitter";
import routes from "../../constants/routes";

export const auth = {
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
                const res = await api.post('auth/login', body);
                if(res.data.success) {
                    dispatch.auth.authenticate({
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
            dispatch.auth.logoutSync();
            await api.post('auth/logout', {})
            return true;
        },
        async register(body) {
            try {
                const res = await api.post('auth/register', body);
                const data = res.data;
                if(data.success) {
                    dispatch.auth.authenticate({
                        token: data.data.token
                    });
                    message.success('Your Registration was Complete');
                    return data.data.token;
                } else {
                    message.error('Something went wrong', 5);
                }
                return false;
            } catch(e) {

                if(e.hasOwnProperty('response')) {
                    const errors = e.response.data.errors;
                    const errorCode = errors[0].errorCode;
                    if(errorCode === 'EMAIL_EXISTS') {
                        message.error('Email already exists, Please login into your view or use forget password')
                    } else {

                        message.error('An Error was occurred');
                    }
                }

                return false;
            }

        },
        async registerFromSocials(body) {
            try {
                const res = await api.post('auth/registerFromSocials', body);
                if(res.data.success) {
                    const resData = res.data;
                    dispatch.profile.setProfile({
                        addresses: resData.data
                    });
                    message.success('Your Profile Information was updated!');
                    return true;
                }
                return false;
            } catch(e) {
                const errorData = e.response.data;
                if(errorData.hasOwnProperty('errors')) {
                    errorData.errors.map(err => {
                        message.error(err.message || 'Something Went wrong', 4)
                    })
                } else {
                    message.error('Something went wrong', 5);
                }
                return false;
            }
        },
        async forgetPassword(body) {
            try {
                const res = await api.post('auth/forgetPassword', body);
                if(res.data.success) {
                    message.success('Reset Link was sent to your email');
                }
                dispatch.auth.destroyResetToken()
            } catch(e) {
                console.log(e);
                message.error('Something went wrong', 5);
            }
        },
        async resetPassword(body) {
            try {
                const res = await api.post('auth/resetPassword', body);
                if(res.data.success) {
                    dispatch.auth.setResetToken({ token: body.token });
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
                const res = await api.post('auth/changePassword', body);
                if(res.data.success) {
                    message.success('Password changed successfully')
                    emitter.emit('change-route', {
                        path: routes.profile.index,
                    })
                    return true;
                }
            } catch(e) {

                if(e.hasOwnProperty('response')) {
                    const errors = e.response.data.errors;
                    const errorCode = errors[0].errorCode;
                    if(errorCode === 'INCORRECT_PASSWORD') {
                        message.error('Password is incorrect')
                    } else {

                        message.error('An Error was occurred');
                    }
                }
                return false;
            }
        }
    })
}