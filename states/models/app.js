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
                console.log(data);
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
        }
    })
}