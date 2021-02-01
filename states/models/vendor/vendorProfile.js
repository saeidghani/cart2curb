import  { getApi } from "../../../lib/api";
import {message} from "antd";

const api = getApi()

export const vendorProfile = {
    state: {
        profile: {},
    },
    reducers: {
        setProfile: (state, payload) => {
            state.profile = payload.profile;
        },
    },
    effects: dispatch => ({
        async getProfile(config) {
            try {
                const res = await api.get('vendor/profile/getProfile', config);
                dispatch.profile.setProfile({
                    profile: res.data.data
                })
                if(res.data.success) {
                    return res.data.data;
                } else {
                    return {};
                }
            } catch(e) {
                return {};
            }
        },
        async updateProfile(body, rootState) {
            try {
                const res = await api.post('vendor/profile/edit', body)
                if(res.data.success) {
                    const resData = res.data;
                    dispatch.profile.setProfile({
                        profile: resData.data
                    });
                }
                message.success('Your Profile Information was updated!');
                return true;
            } catch(e) {
                return false;
            }

        },
    })
}