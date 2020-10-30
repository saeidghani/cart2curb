import api from "../../http/Api";
import {message} from "antd";

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
            state.stores = payload.data;
            state.storesMetaData = payload.metaData
        }

    },
    effects: dispatch => ({
        async getVideos() {
            try {
                const res = await api.app.videos();
                const data = res.data;
                if(data.success) {
                    dispatch.app.setVideos(data.data);
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e);
                message.error('An Error was occurred in data fetch from server')
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
                } else {
                    message.error('An Error was occurred in data fetch')
                }
            } catch(e) {
                console.log(e);
                message.error('An Error was occurred in data fetch from server')
            }
        },
        async getStore(storeId) {
            try {
                const res = await api.app.store(storeId);
                const data = res.data;

                if(data.success) {
                    return data.data;
                } else {
                    return res.status
                }
            } catch(e) {
                return e.response.status
            }
        },
        async getCategories(body) {
            try {
                const res = await api.app.category({ storeId: body.storeId, pageNumber: body.page, pageSize: 30 });
                const data = res.data;

                if(data.success) {
                    return data;
                } else {
                    message.error('An Error was occurred in data fetch')
                    return res.status
                }
            } catch(e) {
                message.error('An Error was occurred in data fetch from the Server')
                return e.response.status
            }
        },
        async getProducts(body) {
            try {
                const res = await api.app.products({ ...body, pageSize: 30 });
                const data = res.data;

                if(data.success) {
                    return data;
                } else {
                    return res.status
                }
            } catch(e) {
                return e.response.status
            }
        },
        async getProduct(id) {

            try {
                const res = await api.app.product(id);
                const data = res.data;

                if(data.success) {
                    return data.data;
                } else {
                    return res.status
                }
            } catch(e) {
                return e.response.status
            }
        }

    })
}