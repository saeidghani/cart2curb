import axios from 'axios';
import {api} from '../../../lib/api';
import {message} from "antd";
import {emitter} from "../../../helpers/emitter";
import routes from "../../../constants/routes";

const getUrl = (url) => `http://165.227.34.172:3003/api/v1/${url}`;

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
        const res = await axios.post(getUrl('admin/auth/login'), body);
        if(res?.data?.success) {
          dispatch?.adminAuth?.authenticate({
            token: res?.data?.data?.token
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
      dispatch?.adminAuth?.logoutSync();
      await api.post('admin/auth/logout', {})
      return true;
    },
    async register(body) {
      try {
        const res = await api.post('admin/auth/register', body);
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
        const res = await api.post(getUrl('admin/auth/forgotPassword'), body);
        if(res?.data?.success) {
          const msg = 'Forgot Your Password?\n' +
              'If an account is associated with the email you have entered, you will receive an email containing instructions and a link to reset your password.'
          message.success(msg);
        }
        dispatch?.adminAuth?.destroyResetToken()
      } catch(e) {
        console.log(e);
        message.error('Something went wrong', 5);
      }
    },
    async resetPassword(body) {
      try {
        const res = await api.post(getUrl('admin/auth/resetPassword'), body);
        if(res.data.success) {
          dispatch?.adminAuth?.setResetToken({ token: body?.token });
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
        const res = await api.post('admin/auth/changePassword', body);
        if(res?.data?.success) {
          message.success('Password changed successfully')
          emitter.emit('change-route', {
            path: routes?.admin?.account?.index,
          })
          return true;
        }
      } catch(e) {
        message.error('Something went wrong', 5);
      }
    }
  })
}