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
                }
            } catch(e) {
                return false;
            }
        },
        async getServerSideCategories({ query, options}) {
            try {
                const res = await api.vendor.store.categories(query, options);
                const data = res.data;
                if(data.success) {
                    return data.data;
                } else {
                    return []
                }
            } catch(e) {
                return []
            }
        },
        async getServerSideCategory({ id, options }) {
            try {
                const res = await api.vendor.store.singleCategory(id,options);
                const data = res.data;
                if(data.success) {
                    return data.data;
                } else {
                    return false
                }
            } catch(e) {
                return false
            }
        },
        async addCategory(body, rootState) {
            try {
                const res = await api.vendor.store.addCategory(body, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                })

                if(res.data.success) {
                    message.success('New Category added successfully!', 5);
                    return true;
                }
                return false;

            } catch(e) {
                return false;
            }
        },
        async editCategory(data, rootState) {
            try {
                const res = await api.vendor.store.editCategory(data.id, data.body, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                })

                if(res.data.success) {
                    message.success('Category info updated successfully!', 5);
                    return true;
                }

                return false;
            } catch(e) {
                return false;
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
                }
                return false;
            } catch(e) {
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
                }
                return false;
            } catch(e) {
                return false;
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
                }
                return false;
            } catch(e) {
                return false;
            }
        },
        async addProduct(body, rootState) {
            try {
                const res = await api.vendor.store.addProduct(body, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                })

                if(res.data.success) {
                    message.success('Product added successfully!', 5);
                    return true;
                }
                return false;
            } catch(e) {
                return false;
            }
        },

        async getProduct({ id, token }) {

            try {
                const res = await api.vendor.store.singleProduct(id, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(res.data.success) {
                    return res.data.data;
                } else {
                    return false
                }
            } catch(e) {
                return false
            }
        },

        async editProduct(data, rootState) {
            try {
                const res = await api.vendor.store.editProduct(data.id, data.body, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                })

                if(res.data.success) {
                    message.success('Product Updated successfully!', 5);
                    return true;
                }
                return false;
            } catch(e) {
                return false;
            }
        },
        async getOrders(query, rootState) {
            try {
                const res = await api.vendor.store.orders(query, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                const data = res.data;
                if(data.success) {
                    dispatch.vendorStore.setOrders({
                        data: data.data,
                        metaData: data.metaData
                    })
                    return data;
                }
                return false;
            } catch(e) {
                return false;
            }
        },
        async getSingleOrder(id, rootState) {
            try {
                const res = await api.vendor.store.singleOrder(id, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });
                const data = res?.data;
                if(data?.success) {
                    return data?.data;
                }
                return false;
            } catch(e) {
                return false;
            }
        },
    })
}