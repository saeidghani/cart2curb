import api from "../../http/Api";
import {message} from "antd";
import ExceptionHandler from "../../exception/ExceptionHandler";

const exceptionHandler = new ExceptionHandler();

export const app = {
    state: {
        videos: [],
        stores: [],
        storesMetaData: {}
    },
    reducers: {
        setVideos: (state, payload) => {
            state.videos = payload;
        },
        setStores: (state, payload) => {
            if(payload.metaData.pagination.pageNumber === 1) {
                state.stores = payload.data;
            } else {
                state.stores = [...state.stores, ...payload.data];

            }
            state.storesMetaData = payload.metaData;
        }

    },
    effects: dispatch => ({
        async getVideos() {
            try {
                const res = await api.app.videos();
                const data = res.data;
                if(data.success) {
                    dispatch.app.setVideos(data.data);
                    return true;
                }
                exceptionHandler.throwError()
            } catch(e) {
                exceptionHandler.throwError(e?.response);
            }
        },
        async getStores(query) {
            try {
                const res = await api.app.stores(query);
                const data = res.data;
                if(data.success) {
                    dispatch.app.setStores({
                        data: data.data,
                        metaData: data.metaData,
                    });
                    return data;
                }
                exceptionHandler.throwError()
            } catch(e) {
                exceptionHandler.throwError(e?.response);
            }
        },
        async getStore(storeId) {
            try {
                const res = await api?.app?.store(storeId);
                const data = res?.data;
                if(data.success) {
                    return data.data;
                } else {
                    return false
                }
            } catch(e) {
                return false
            }
        },
        async getCategories(body) {
            try {
                const res = await api.app.category({ storeId: body.storeId, pageNumber: body.page, pageSize: 30 });
                const data = res.data;

                if(data.success) {
                    return data;
                } else {
                    exceptionHandler.throwError();
                    return false
                }
            } catch(e) {
                exceptionHandler.throwError(e?.response);
                return false
            }
        },
        async getCategoryTree(body) {
            try {
                const res = await api.app.categoryTree({ storeId: body.storeId, pageNumber: body.page, pageSize: 30 });
                const data = res.data;

                if(data.success) {
                    return data;
                } else {
                    exceptionHandler.throwError();
                    return false
                }
            } catch(e) {
                exceptionHandler.throwError(e?.response);
                return false
            }
        },
        async getProducts(body) {
            try {
                const res = await api.app.products({ ...body, pageSize: 15 });
                const data = res.data;

                if(data.success) {
                    return data;
                } else {
                    return false
                }
            } catch(e) {
                return false
            }
        },
        async getProduct(id) {

            try {
                const res = await api.app.product(id);
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
        async contact(body) {
            try {
                const res = await api.app.contact(body);
                if(res?.data?.success) {
                    return true;
                } else {
                    exceptionHandler.throwError()
                    return false;
                }
            } catch(e) {
                exceptionHandler.throwError(e?.response);
                return false;
            }
        }

    })
}
