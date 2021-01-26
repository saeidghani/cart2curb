import api from "../../../http/Api";
import {message} from "antd";

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const driverDelivery = {
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
                const res = await api?.driver?.delivery?.getDeliveries(query, setOptions(rootState?.driverAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this.setDeliveries({
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
        async editDelivery({deliveryId, body, token}) {
            try {
                const res = await api?.driver?.delivery?.editDelivery(deliveryId, body, setOptions(token))
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
    })
};