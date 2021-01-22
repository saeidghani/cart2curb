import api from '../../../http/Api';
import {message} from "antd";

const setOptions = token => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const adminProfile = {
  state: {
    profile: {},
    promo: {},
    systemConfig: {},
    promos: {
      metaData: {},
      data: []
    },
    customerMessages: {
      metaData: {},
      data: []
    },
  },
  reducers: {
    setProfile: (state, payload) => {
      state.profile = payload;
    },
    setPromo: (state, payload) => {
      state.promo = payload;
    },
    setSystemConfig: (state, payload) => {
      state.systemConfig = payload;
    },
    setPromos: (state, payload) => {
      if(payload?.metaData?.pagination?.pageNumber === 1) {
        state.promos.data = payload.data;
      } else {
        state.promos.data = [...state.promos.data, ...payload.data];

      }
      state.promos.metaData = payload.metaData;
    },
    setCustomerMessages: (state, payload) => {
      if(payload?.metaData?.pagination?.pageNumber === 1) {
        state.customerMessages.data = payload.data;
      } else {
        state.customerMessages.data = [...state.customerMessages.data, ...payload.data];

      }
      state.customerMessages.metaData = payload.metaData;
    },
  },
  effects: dispatch => ({
    async getProfile({token}) {
      try {
        const res = await api?.admin?.profile?.getProfile(setOptions(token));
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
    async editProfile({body, token}) {
      try {
        const res = await api?.admin?.profile?.editProfile(body, setOptions(token))

        if(res.data.success) {
          message.success(' Updated successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        if(e.hasOwnProperty('response')) {
          console.log(e.response);
        }
        message.error('An Error was occurred');
        return false;
      }
    },
    async changePassword({body, token}) {
      try {
        const res = await api?.admin?.profile?.changePassword(body, setOptions(token))

        if(res.data.success) {
          message.success(' Updated successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        if(e.hasOwnProperty('response')) {
          console.log(e.response);
        }
        message.error('An Error was occurred');
        return false;
      }
    },
    async getPromos({query, token}) {
      try {
        const res = await api?.admin?.profile?.getPromos(query, setOptions(token));
        if(res?.data?.success) {
          this.setPromos({
            data: res?.data?.data,
            metaData: res?.data?.metaData
          });
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
    async getPromo({promoId, token}) {
      try {
        const res = await api?.admin?.profile?.getPromo(promoId, setOptions(token));
        if(res?.data?.success) {
          this.setPromo(res?.data?.data);
          return res?.data?.data
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
    async deletePromo({promoId, token}) {
      try {
        const res = await api?.admin?.profile?.deletePromo(promoId, setOptions(token));
        if(res?.data?.success) {
          message.success('Deleted Successfully', 5);
          return true;
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
    async addPromo({ body, token}) {
      try {
        const res = await api?.admin?.profile?.addPromo(body, setOptions(token));

        if(res.data.success) {
          message.success('New Promo added successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        console.log(e);
        if(e.hasOwnProperty('response')) {
          message.error('An Error was occurred');
        }
        return false;
      }
    },
    async editPromo({promoId, body, token}) {
      try {
        const res = await api?.admin?.profile?.editPromo(promoId, body, setOptions(token))

        if(res.data.success) {
          message.success(' Updated successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        if(e.hasOwnProperty('response')) {
          console.log(e.response);
        }
        message.error('An Error was occurred');
        return false;
      }
    },
    async getSystemConfig({token}) {
      try {
        const res = await api?.admin?.profile?.getSystemConfig(setOptions(token));
        if(res?.data?.success) {
          this.setSystemConfig(res?.data?.data);
          return res?.data?.data
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
    async editSystemConfig({body, token}) {
      try {
        const res = await api?.admin?.profile?.editSystemConfig(body, setOptions(token));

        if(res?.data?.success) {
          message.success('Updated successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        if(e.hasOwnProperty('response')) {
          console.log(e.response);
        }
        message.error('An Error was occurred');
        return false;
      }
    },
    async getCustomerMessages({query, token}) {
      try {
        const res = await api?.admin?.profile?.getCustomerMessages(query, setOptions(token));
        return res?.data;
        if(res?.data?.success) {
          this.setCustomerMessages({
            data: res?.data?.data,
            metaData: res?.data?.metaData
          });
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
    async addRank({ body, token}) {
      try {
        const res = await api?.admin?.profile?.addRank(body, setOptions(token));

        if(res.data.success) {
          message.success('New Promo added successfully!', 5);
          return true;
        } else {
          message.error('An Error was occurred');
          return false;
        }
      } catch(e) {
        console.log(e);
        if(e.hasOwnProperty('response')) {
          message.error('An Error was occurred');
        }
        return false;
      }
    },
  })
}