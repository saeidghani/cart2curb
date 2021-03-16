import axios from 'axios';
import {useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {defaultMapLocation} from "../constants";

export const api = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/geocode",
    timeout: 30000
})

api.interceptors.response.use(res => {
    if(res?.hasOwnProperty('data')) {
        return res?.data;
    }

    return res;
}, err => {
    if(err?.hasOwnProperty("response")) {
        return err?.response?.data;
    }

    return err;
});


export const useGeocoding = () => {
    const [geocode, setGeocode] = useState(defaultMapLocation);
    const debounced = useDebouncedCallback(
        async (value) => {
            if (/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/.test(value)) {
                const transformedPostal = value.slice(0, 3).trim() + " " + value.slice(-3).trim();

                try {

                    const res = await api.get("json", {
                        params: {
                            address: transformedPostal,
                            key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
                        }
                    })
                    if(res?.status === "OK") {
                        setGeocode(res?.results?.[0]?.geometry?.location);
                        return res?.results?.[0]?.geometry?.location;
                    }
                } catch(e) {
                    return e;
                }
            }

            return null;
        },
        600
    )

    return [geocode, debounced.callback];

}

