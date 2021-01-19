import {message} from "antd";
import {emitter} from "../../../helpers/emitter";
import routes from "../../../constants/routes";
import api from '../../../http/Api';

export const adminAuth = {
  state: {
    isLoggedIn: false,
    token: null,
    resetToken: null,
    isReseted: false,
    resetAttempt: 0,
  },
  reducers: {
    authenticate: (state, payload) => {
      window.localStorage.setItem("admin_token", payload?.token);
      state.isLoggedIn = true;
      state.token = payload?.token;
    },
    logoutSync: (state) => {
      window.localStorage.setItem("admin_token", "");

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
        const res = await api?.admin?.auth?.login(body);

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
      await api.admin.auth.logout();
      return true;
    },
    async register(body) {
      try {
        const res = await api.admin.auth.register(body);
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
        const res = await api.admin.auth.forgetPassword(body);
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
        const res = await api.admin.auth.resetPassword(body);
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
    async changePassword(body) {
      try {
        const res = await api.admin.auth.changePassword(body);
        if(res?.data?.success) {
          message.success('Password changed successfully')
          emitter.emit('change-route', {
            path: routes?.admin?.auth.profile
          })
          return true;
        }
      } catch(e) {
        message.error('Something went wrong', 5);
      }
    }
  })
}