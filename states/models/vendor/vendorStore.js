import api from "../../../http/Api";
import {message} from "antd";

export const vendorStore = {
    state: {
        products: {
            metaData: {},
            data: []
        },
        categories: {
            metaData: {},
            data: []
        },
        orders: {
            metaData: {},
            data: []
        },
    },
    reducers: {
        setCategories: (state, payload) => {
            if(payload.metaData.pagination.pageNumber === 1) {
                state.categories.data = payload.data;
            } else {
                state.categories.data = [...state.categories.data, ...payload.data];

            }
            state.categories.metaData = payload.metaData;
        },
        setProducts: (state, payload) => {
            if(payload.metaData.pagination.pageNumber === 1) {
                state.products.data = payload.data;
            } else {
                state.products.data = [...state.products.data, ...payload.data];

            }
            state.products.metaData = payload.metaData;
        }
    },
    effects: dispatch => ({
        async getCategories(query, rootState) {
            try {
                const res = await api.vendor.store.categories(query, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                const data = res.data;
                if(data.success) {
                    dispatch.vendorStore.setCategories({
                        data: data.data,
                        metaData: data.metaData
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
        async deleteCategory(id, rootState) {
            try {
                const res = await api.vendor.store.deleteCategory(id, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                if(res.data.success) {
                    message.success('Deleted Successfully', 5);
                    return true;
                } else {
                    message.error('An Error was occurred');
                    return false;
                }
            } catch(e) {
                if(e.hasOwnProperty('response')) {
                    const errors = e.response.data.errors;
                    const errorCode = errors[0].errorCode;
                    if(errorCode === 'HAS_CHILDREN') {
                        message.error('You Can\'t Delete this Category because it has children')
                    } else {

                        message.error('An Error was occurred');
                    }
                }
                return false;
            }
        },
        async getProducts(query, rootState) {
            try {
                const res = await api.vendor.store.products(query, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                const data = res.data;
                if(data.success) {
                    dispatch.vendorStore.setProducts({
                        data: data.data,
                        metaData: data.metaData
                    })
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                message.error('An Error was occurred in data fetch from the Server')
            }
        },
        async deleteProduct(id, rootState) {
            try {
                const res = await api.vendor.store.deleteProduct(id, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                if(res.data.success) {
                    message.success('Deleted Successfully', 5);
                    return true;
                } else {
                    message.error('An Error was occurred');
                    return false;
                }
            } catch(e) {
                console.log(e);
                message.error('An Error was occurred');
                return false;
            }
        }
    })
}