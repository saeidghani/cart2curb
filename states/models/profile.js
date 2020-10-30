import  { api } from "../../lib/api";
import {message} from "antd";
import {emitter} from "../../helpers/emitter";


export const profile = {
    state: {
        profile: {},
        addresses: [],
        payments: [],
    },
    reducers: {
        setProfile: (state, payload) => {
            state.profile = payload.profile;
        },
        setAddresses: (state, payload) => {
            state.addresses = payload.addresses
        },
        setPayments: (state, payload) => {
            state.payments = payload.payments
        }
    },
    effects: dispatch => ({
        async getProfile(config) {
            try {
                const res = await api.get('profile/getProfile', config);
                dispatch.profile.setProfile({
                    profile: res.data.data
                })
                if(res.data.success) {
                    return res.data.data;
                } else {
                    return {};
                }
            } catch(e) {
                console.log(e);
            }
        },
        async updateProfile(body) {

            try {
                const res = await api.post('auth/registerInfo', body);
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
        async getAddresses(config) {
            try {
                const res = await api.get('profile/address/getAddresses', config);
                dispatch.profile.setAddresses({
                    profile: res.data.data
                })
                if(res.data.success) {
                    return res.data.data;
                } else {
                    return {};
                }
            } catch(e) {
                console.log(e);
            }
        },
        async deleteAddress(id) {
            try {
                const res = await api.post('profile/address/delete', { id });
                if(res.data.success) {
                    message.success('Address Deleted successfully!', 5);
                    return true;
                } else {
                    message.error('Something went wrong');
                    return false;
                }
            } catch(e) {
                console.log(e);
                message.error('Something went wrong');
                return false;
            }
        },
        async addAddress(body) {
            try {
                const res = await api.post('profile/address/add', body);
                if(res.data.success) {
                    const resData = res.data;
                    dispatch.profile.setProfile({
                        addresses: resData.data
                    });
                }
                message.success('New Address Added!');
                return true;
            } catch(e) {
                const errorData = e.response.data;
                if(errorData.hasOwnProperty('errors')) {
                    errorData.errors.map(err => {
                        message.error(err.message || 'Something Went wrong', 4)
                    })
                } else {
                    message.error('Something went wrong', 5);
                }
            }
        },
        async getPayments(config) {

            try {
                const res = await api.get('profile/payments/getPayments', config);
                dispatch.profile.setPayments({
                    profile: res.data.data
                })
                if(res.data.success) {
                    return res.data.data;
                } else {
                    return {};
                }
            } catch(e) {
                console.log(e);
            }
        },
        async deletePayment(id) {

            try {
                const res = await api.post('profile/payments/delete', { id });
                if(res.data.success) {
                    message.success('Card Deleted successfully!', 5);
                    return true;
                } else {
                    message.error('Something went wrong');
                    return false;
                }
            } catch(e) {
                console.log(e);
                message.error('Something went wrong');
                return false;
            }
        },
        async addPayment(body) {
            try {
                const res = await api.post('profile/payments/add', body);
                if(res.data.success) {
                    const resData = res.data;
                    dispatch.profile.setProfile({
                        addresses: resData.data
                    });
                }
                message.success('New Card Added!');
                return true;
            } catch(e) {
                const errorData = e.response.data;
                if(errorData.hasOwnProperty('errors')) {
                    errorData.errors.map(err => {
                        message.error(err.message || 'Something Went wrong', 4)
                    })
                } else {
                    message.error('Something went wrong', 5);
                }
            }
        }
    })
}