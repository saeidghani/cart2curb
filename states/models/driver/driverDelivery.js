import api from "../../../http/Api";
import {message} from "antd";

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const driverDelivery = {
    state: {
        availableDeliveries: {
            metaData: {},
            data: []
        },
        historyDeliveries: {
            metaData: {},
            data: []
        },
        currentDeliveries: {
            metaData: {},
            data: []
        },
        customerOrders: {},
    },
    reducers: {
        setAvailableDeliveries: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.availableDeliveries.data = payload.data;
            } else {
                state.availableDeliveries.data = [...state.availableDeliveries.data, ...payload.data];

            }
            state.availableDeliveries.metaData = payload.metaData;
        },
        setHistoryDeliveries: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.historyDeliveries.data = payload.data;
            } else {
                state.historyDeliveries.data = [...state.historyDeliveries.data, ...payload.data];
            }
            state.historyDeliveries.metaData = payload.metaData;
        },
        setCurrentDeliveries: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.currentDeliveries.data = payload.data;
            } else {
                state.currentDeliveries.data = [...state.currentDeliveries.data, ...payload.data];

            }
            state.currentDeliveries.metaData = payload.metaData;
        },
        setCustomerOrders: (state, payload) => {
            state.customerOrders = payload;
        },
    },
    effects: dispatch => ({
        async getAvailableDeliveries(query, rootState) {
            try {
                const res = await api?.driver?.delivery?.getAvailableDeliveries(query, setOptions(rootState?.driverAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this.setAvailableDeliveries({
                        data: data?.data,
                        metaData: data?.metaData
                    })
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e)
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async getHistoryDeliveries(query, rootState) {
            try {
                const res = await api?.driver?.delivery?.getHistoryDeliveries(query, setOptions(rootState?.driverAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this.setHistoryDeliveries({
                        data: data?.data,
                        metaData: data?.metaData
                    })
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e)
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async getCurrentDeliveries(query, rootState) {
            try {
                const res = await api?.driver?.delivery?.getCurrentDeliveries(query, setOptions(rootState?.driverAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this.setCurrentDeliveries({
                        data: data?.data,
                        metaData: data?.metaData
                    })
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e)
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async getCustomerOrders({deliveryId, token}) {
            try {
                const res = await api?.driver?.delivery?.getCustomerOrders(deliveryId, setOptions(token));
                if(res?.data?.success) {
                    this.setCustomerOrders(res?.data?.data);
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
        async editDeliveryAvailable({deliveryId, body, token}) {
            try {
                const res = await api?.driver?.delivery?.editDeliveryAvailable(deliveryId, body, setOptions(token))
                if(res.data.success) {
                    message.success(' Updated successfully!', 5);
                    return res;
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
        async editDeliveryComplete({deliveryId, body, token}) {
            try {
                const res = await api?.driver?.delivery?.editDeliveryComplete(deliveryId, body, setOptions(token))
                if(res.data.success) {
                    message.success(' Updated successfully!', 5);
                    return res;
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
        async addDeliveryGathered({deliveryId, body, token}) {
            try {
                const res = await api?.driver?.delivery?.addDeliveryGathered(deliveryId, body, setOptions(token));

                if (res.data.success) {
                    message.success('added successfully!', 5);
                    return true;
                } else {
                    message.error('An Error was occurred');
                    return false;
                }
            } catch (e) {
                console.log(e);
                if (e.hasOwnProperty('response')) {
                    message.error('An Error was occurred');
                }
                return false;
            }
        },
    })
};