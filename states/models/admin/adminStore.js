import api from "../../../http/Api";
import {message} from "antd";

const setOptions = token => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const adminStore = {
    state: {
        orders: {
            metaData: {},
            data: []
        },
        stores: {
            metaData: {},
            data: []
        },
        storesRank: {
            metaData: {},
            data: []
        },
        products: {
            metaData: {},
            data: []
        },
        categories: {
            metaData: {},
            data: []
        },
        services: {
            metaData: {},
            data: []
        },
        product: {},
        service: {},
        store: {},
    },
    reducers: {
        setStores: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.stores.data = payload.data;
            } else {
                state.stores.data = [...state.stores.data, ...payload.data];

            }
            state.stores.metaData = payload.metaData;
        },
        setCategories: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.categories.data = payload.data;
            } else {
                state.categories.data = [...state.categories.data, ...payload.data];

            }
            state.categories.metaData = payload.metaData;
        },
        setProducts: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.products.data = payload.data;
            } else {
                state.products.data = [...state.products.data, ...payload.data];

            }
            state.products.metaData = payload.metaData;
        },
        setServices: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.services.data = payload.data;
            } else {
                state.services.data = [...state.services.data, ...payload.data];

            }
            state.services.metaData = payload.metaData;
        },
        setOrders: (state, payload) => {
            if(payload?.metaData?.pagination?.pageNumber === 1) {
                state.orders.data = payload.data;
            } else {
                state.orders.data = [...state.orders.data, ...payload.data];

            }
            state.orders.metaData = payload.metaData;
        },
        setOrder: (state, payload) => {
            state.order = payload;
        },
        setProduct: (state, payload) => {
            state.product = payload;
        },
        setStore: (state, payload) => {
            state.store = payload;
        },
        setService: (state, payload) => {
            state.service = payload;
        },
    },
    effects: dispatch => ({
        async getOrders(query, rootState) {
            try {
                const res = await api?.admin?.store?.getOrders(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setOrders({
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
        async getOrder({orderId, token}) {
            try {
                const res = await api?.admin?.store?.getOrder(orderId, setOptions(token));
                if(res?.data?.success) {
                    this.setOrder(res?.data?.data);
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
        async getStores(query, rootState) {
            try {
                const res = await api?.admin?.store?.getStores(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setStores({
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
        async getStoresRank(query, rootState) {
            try {
                const res = await api?.admin?.store?.getStoresRank(query, setOptions(rootState?.adminAuth?.token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setStoresRank({
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
        async addStoreRank(body, rootState) {
            try {
                const res = await api?.admin?.store?.addStoreRank(body, setOptions(rootState?.adminAuth?.token))

                if(res.data.success) {
                    message.success('New Rank added successfully!', 5);
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
        async deleteStoreRank(storeId, rootState) {
            try {
                const res = await api?.admin?.store?.deleteStoreRank(storeId, setOptions(rootState?.adminAuth?.token));
                if(res.data.success) {
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
        async getStore(storeId, rootState) {
            try {
                const res = await api?.admin?.store?.getStore(storeId, setOptions(rootState?.adminAuth?.token));
                if(res.data.success) {
                    this.setStore(res.data.data);
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
        async editStore({storeId, body, token}) {
            try {
                const res = await api?.admin?.store?.editStore(storeId, body, setOptions(token));

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
        async getCategories({storeId, query, token}) {
            try {
                const res = await api?.admin?.store?.getCategories(storeId, query, setOptions(token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setCategories({
                        data: data?.data,
                        metaData: data?.metaData
                    })
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async addCategory({storeId, body, token}) {
            try {
                const res = await api?.admin?.store?.addCategory(storeId, body, setOptions(token))

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
        async editCategory({storeId, categoryId, body, token}) {
            try {
                const res = await api?.admin?.store?.editCategory(storeId, categoryId, body, setOptions(token))

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
        async deleteCategory({storeId, categoryId, token}) {
            try {
                const res = await api?.admin?.store?.deleteCategory(storeId, categoryId, setOptions(token));
                if(res.data.success) {
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
        async getProducts({storeId, query, token}) {
            try {
                const res = await api?.admin?.store?.getProducts(storeId, query, setOptions(token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setProducts({
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
        async addProduct({storeId, body, token}) {
            try {
                const res = await api?.admin?.store?.addProduct(storeId, body, setOptions(token))

                if(res.data.success) {
                    message.success('New Product added successfully!', 5);
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
        async getProduct({storeId, productId, token}) {
            try {
                const res = await api?.admin?.store?.getProduct(storeId, productId, setOptions(token));
                if(res.data.success) {
                    this.setProduct(res.data.data);
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
        async editProduct({storeId, productId, body, token}) {
            try {
                const res = await api?.admin?.store?.editProduct(storeId, productId, body, setOptions(token))

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
        async deleteProduct({storeId, productId, token}) {
            try {
                const res = await api?.admin?.store?.deleteProduct(storeId, productId, setOptions(token));
                if(res.data.success) {
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
        async getServices({storeId, query, token}) {
            try {
                const res = await api?.admin?.store?.getServices(storeId, query, setOptions(token));
                const data = res?.data;
                if(data?.success) {
                    dispatch?.adminStore?.setServices({
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
        async addService({storeId, body, token}) {
            try {
                const res = await api?.admin?.store?.addService(storeId, body, setOptions(token))

                if(res.data.success) {
                    message.success('New Service added successfully!', 5);
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
        async getService({storeId, serviceId, token}) {
            try {
                const res = await api?.admin?.store?.getService(storeId, serviceId, setOptions(token));
                if(res.data.success) {
                    this.setService(res.data.data);
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
        async editService({storeId, serviceId, body, token}) {
            try {
                const res = await api?.admin?.store?.editService(storeId, serviceId, body, setOptions(token))

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
        async deleteService({storeId, serviceId, token}) {
            try {
                const res = await api?.admin?.store?.deleteService(storeId, serviceId, setOptions(token));
                if(res.data.success) {
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
    })
}