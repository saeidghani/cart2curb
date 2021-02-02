import {getApi} from '../../lib/api';
import {message} from "antd";
import {emitter} from "../../helpers/emitter";
import routes from "../../constants/routes";
import ExceptionHandler from "../../exception/ExceptionHandler";

const api = getApi(true);
const exceptionHandler = new ExceptionHandler()

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
                }

                exceptionHandler.throwError({}, 'Username or password is wrong');
                return false;
            } catch(e) {
                exceptionHandler.throwError(e?.response, 'Username or password is wrong');
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
                    message.success('Your Registration was complete');
                    return data.data.token;
                }
                exceptionHandler.throwError();
                return false;
            } catch(e) {
                exceptionHandler.throwError(e?.response);
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
                exceptionHandler.throwError();
                return false;
            } catch(e) {
                exceptionHandler.throwError(e?.response);

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
                exceptionHandler.throwError(e?.response);
            }
        },
        async resetPassword(body) {
            try {
                const res = await api.post('auth/resetPassword', body);
                if(res.data.success) {
                    dispatch.auth.setResetToken({ token: body.token });
                    message.success('Your Password was changed!');
                    return true;
                }

                exceptionHandler.throwError({}, 'Your Token is not valid or expired');
                return false;

            } catch(e) {
                exceptionHandler.throwError(e?.response, 'Your Token is not valid or expired');
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
                exceptionHandler.throwError(e?.response);
                return false;
            }
        }
    })
}