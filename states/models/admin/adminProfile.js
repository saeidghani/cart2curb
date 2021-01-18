import api from '../../../http/Api';
import {message} from "antd";

const setOptions = token => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const adminProfile = {
  state: {
    profile: {}
  },
  reducers: {
    setProfile: (state, payload) => {
      state.profile = payload;
    },
  },
  effects: dispatch => ({
    async getProfile({token}) {
      try {
        const res = await api?.admin?.profile?.getProfile(setOptions(token));
        console.log(res);
        if(res?.data?.success) {
          this.setProfile(res?.data?.data);
          return res?.data?.data;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        if(e.hasOwnProperty('response')) {
          message.error('An Error was occurred');
        }
        return false;
      }
    },
  })
}