import  { getApi } from "../../lib/api";
import Api from '../../http/Api';
import {message} from "antd";
import {emitter} from "../../helpers/emitter";
import ExceptionHandler from "../../exception/ExceptionHandler";

const api = getApi();
const exceptionHandler = new ExceptionHandler();

export const profile = {
    state: {
        profile: {},
        addresses: [],
        payments: [],
        orders: {
            metaData: {},
            data: []
        },
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
        },
        setOrders: (state, payload) => {
            if(payload.metaData.pagination.pageNumber === 1) {
                state.orders.data = payload.data;
            } else {
                state.orders.data = [...state.orders.data, ...payload.data];

            }
            state.orders.metaData = payload.metaData;
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
                return {};
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
                return {};
            }
        },
        async deleteAddress(id) {
            try {
                const res = await api.post('profile/address/delete', { id });
                if(res.data.success) {
                    message.success('Address Deleted successfully!', 5);
                    return true;
                }
                return false;
            } catch(e) {
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
                return false;
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
                return {};
            }
        },
        async deletePayment(id) {

            try {
                const res = await api.post('profile/payments/delete', { id });
                if(res.data.success) {
                    message.success('Card Deleted successfully!', 5);
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
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
                return false;
            }
        },
        async getOrders(body, rootState) {
            try {
                const res = await Api.customer.profile.orders(body, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.token}`
                    }
                });
                const data = res.data;
                if(data.success) {
                    dispatch.profile.setOrders({
                        data: data.data,
                        metaData: data.metaData
                    })
                    return data;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async getSingleOrder(id, rootState) {
            try {
                const res = await Api.customer.profile.singleOrder(id, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.token}`
                    }
                });
                const data = res?.data;
                if(data?.success) {
                    return data?.data;
                }
                exceptionHandler.throwError();
                return false;
            } catch(e) {
                console.log(e);
                exceptionHandler.throwError(e?.response);
                return false;
            }
        },
        async deleteOrder(id, rootState) {
            try {
                const res = await Api.customer.profile.deleteOrder(id, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.token}`
                    }
                });
                if(res?.data?.success) {
                    message.success('Deleted Successfully', 5);
                    return true;
                }
                exceptionHandler.throwError();
                return false;
            } catch(e) {
                exceptionHandler.throwError(e?.response);
                return false;
            }
        },
        async reportOrder(data, rootState) {
            try {
                const res = await Api.customer.profile.reportOrder(data.id, data.body, {
                    headers: {
                        Authorization: `Bearer ${rootState.auth.token}`
                    }
                });
                if(res?.data?.success) {
                    return true;
                }
                exceptionHandler.throwError();
                return false;
            } catch(e) {
                exceptionHandler.throwError(e?.response);
                return false;
            }
        }
    })
}