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
        pendingDrivers: {
            metaData: {},
            data: []
        },
        driversApproved: {
            metaData: {},
            data: []
        },
        vendor: {},
        customer: {},
        driver: {},
        pendingDriversCount: '',
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
            state.pendingVendors.data = payload.data;
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
        setDriver: (state, payload) => {
            state.driver = payload;
        },
        setDrivers: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.drivers.data = payload.data;
            } else {
                state.drivers.data = [...state.drivers.data, ...payload.data];
            }
            state.drivers.metaData = payload.metaData;
        },
        setPendingDrivers: (state, payload) => {
            state.pendingVendors.data = payload.data;
        },
        setPendingDriversCount: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.pendingDriversCount.data = payload.data;
            } else {
                state.pendingDriversCount.data = [...state.pendingDriversCount.data, ...payload.data];
            }
            state.pendingDriversCount.metaData = payload.metaData;
        },
        setDriversApproved: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.driversApproved.data = payload.data;
            } else {
                state.driversApproved.data = [...state.driversApproved.data, ...payload.data];
            }
            state.driversApproved.metaData = payload.metaData;
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
        async getPendingDrivers(query, rootState) {
            try {
                const res = await api?.admin?.user?.getPendingDrivers(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminUser?.setPendingDrivers({
                        data: data?.data,
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
        async getDriversApproved(query, rootState) {
            try {
                const res = await api?.admin?.user?.getDriversApproved(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminUser?.setDriversApproved({
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
        async addDriver({body, token}) {
            console.log(setOptions(token));
            try {
                const res = await api?.admin?.user?.addDriver(body, setOptions(token))

                if(res.data.success) {
                    message.success('New Driver added successfully!', 5);
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
        async addPendingDriver({driverId, body, token}) {
            try {
                const res = await api?.admin?.user?.addPendingDriver(driverId, body, setOptions(token))

                if(res.data.success) {
                    message.success('Updated successfully!', 5);
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
        async getDriver(driverId, rootState) {
            try {
                const res = await api?.admin?.user?.getDriver(driverId, setOptions(rootState?.adminAuth?.token));
                if(res.data.success) {
                    this.setDriver(res.data.data);
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
        async getPendingDriversCount(query, rootState) {
            try {
                const res = await api?.admin?.user?.getPendingDriversCount(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    return data
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
        async editDriver({driverId, body, token}) {
            try {
                const res = await api?.admin?.user?.editDriver(driverId, body, setOptions(token));

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
        async addVendor({body, token}) {
            try {
                const res = await api?.admin?.user?.addVendor(body, setOptions(token));
                if(res.data.success) {
                    message.success('New vendor added successfully!', 5);
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
                    message.success('New Customer added successfully!', 5);
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