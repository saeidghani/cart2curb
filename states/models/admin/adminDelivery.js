import api from "../../../http/Api";
import {message} from "antd";

export const adminDelivery = {
    state: {
        deliveries: {
            metaData: {},
            data: []
        },
    },
    reducers: {
        setDeliveries: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.deliveries.data = payload.data;
            } else {
                state.deliveries.data = [...state.deliveries.data, ...payload.data];

            }
            state.deliveries.metaData = payload.metaData;
        },
    },
    effects: dispatch => ({
        async getDeliveries(query, rootState) {
            try {
                const res = await api?.admin?.delivery?.getDeliveries(query, {
                    headers: {
                        Authorization: `Bearer ${rootState?.adminAuth?.token}`
                    }
                });
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminDelivery.setDeliveries({
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
        async editDelivery(deliveryId, body, rootState) {
            try {
                const res = await api?.admin?.delivery?.editDelivery(deliveryId, body, {
                    headers: {
                        Authorization: `Bearer ${rootState?.adminAuth?.token}`
                    }
                })

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
        async editDeliveryComplete(deliveryId, body, rootState) {
            try {
                const res = await api?.admin?.delivery?.editDeliveryComplete(deliveryId, body, {
                    headers: {
                        Authorization: `Bearer ${rootState?.adminAuth?.token}`
                    }
                })

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
        async editDeliveryUnassign(deliveryId, body, rootState) {
            try {
                const res = await api?.admin?.delivery?.editDeliveryUnassign(deliveryId, body, {
                    headers: {
                        Authorization: `Bearer ${rootState?.adminAuth?.token}`
                    }
                })

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
    })
}