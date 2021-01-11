import api from "../../../http/Api";
import {message} from "antd";

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const adminUser = {
    state: {
        vendors: {
            metaData: {},
            data: []
        },
        pendingVendors: {
            metaData: {},
            data: []
        },
        customers: {
            metaData: {},
            data: []
        },
        drivers: {
            metaData: {},
            data: []
        },
        vendor: {},
        customer: {},
    },
    reducers: {
        setVendors: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.vendors.data = payload.data;
            } else {
                state.vendors.data = [...state.vendors.data, ...payload.data];

            }
            state.vendors.metaData = payload.metaData;
        },
        setPendingVendors: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.pendingVendors.data = payload.data;
            } else {
                state.pendingVendors.data = [...state.pendingVendors.data, ...payload.data];

            }
            state.pendingVendors.metaData = payload.metaData;
        },
        setCustomers: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.customers.data = payload.data;
            } else {
                state.customers.data = [...state.customers.data, ...payload.data];

            }
            state.customers.metaData = payload.metaData;
        },
        setVendor: (state, payload) => {
            state.vendor = payload;
        },
        setCustomer: (state, payload) => {
            state.customer = payload;
        },
        setDrivers: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.drivers.data = payload.data;
            } else {
                state.drivers.data = [...state.drivers.data, ...payload.data];
            }
            state.drivers.metaData = payload.metaData;
        },
    },
    effects: dispatch => ({
        async getDrivers(query, rootState) {
            try {
                const res = await api?.admin?.user?.getDrivers(query, setOptions(rootState?.adminAuth?.token));
                console.log(res);
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminUser?.setDrivers({
                        data: data?.data,
                        metaData: data?.metaData
                    })
                    return res;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e)
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async getVendors(query, rootState) {
            try {
                const res = await api?.admin?.user?.getVendors(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this?.setVendors({
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
        async addVendor(body, rootState) {
            try {
                const res = await api?.admin?.user?.addVendor(body, setOptions(rootState?.adminAuth?.token))

                if(res.data.success) {
                    message.success('New Category added successfully!', 5);
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
        async getVendor(vendorId, rootState) {
            try {
                const res = await api?.admin?.user?.getVendor(vendorId, setOptions(rootState?.adminAuth?.token));
                if(res.data.success) {
                    this.setVendor(res.data.data);
                    return res.data.data
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
        async editVendor({vendorId, body, token}) {
            try {
                const res = await api?.admin?.user?.editVendor(vendorId, body, setOptions(token));

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
        async getPendingVendors(query, rootState) {
            try {
                const res = await api?.admin?.user?.getPendingVendors(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this?.setPendingVendors({
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
        async getPendingVendorsCount(query, rootState) {
            try {
                const res = await api?.admin?.user?.getPendingVendorsCount(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e)
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async addPendingVendor({vendorId, body, token}) {
            console.log(body);
            try {
                const res = await api?.admin?.user?.addPendingVendor(vendorId, body, setOptions(token))

                if(res.data.success) {
                    message.success('updated successfully!', 5);
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
        async getCustomers(query, rootState) {
            try {
                const res = await api?.admin?.user?.getCustomers(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    this?.setCustomers({
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
        async addCustomer({body, token}) {
            console.log({body, token});
            try {
                const res = await api?.admin?.user?.addCustomer(body, setOptions(token))

                if(res.data.success) {
                    message.success('New Category added successfully!', 5);
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
        async getCustomer(customerId, rootState) {
            try {
                const res = await api?.admin?.user?.getCustomer(customerId, setOptions(rootState?.adminAuth?.token));
                if(res.data.success) {
                    this.setCustomer(res.data.data);
                    return res.data.data
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
        async editCustomer({customerId, body, token}) {
            try {
                const res = await api?.admin?.user?.editCustomer(customerId, body, setOptions(token));

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
        async editCustomerBlock({customerId, body, token}) {
            try {
                const res = await api?.admin?.user?.editCustomerBlock(customerId, body, setOptions(token));

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
        async editCustomerUnBlock({customerId, body, token}) {
            try {
                const res = await api?.admin?.user?.editCustomerUnBlock(customerId, body, setOptions(token));

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