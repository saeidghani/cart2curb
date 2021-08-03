import axios from 'axios';

import {emitter} from "../helpers/emitter";

export default class ApiInstance {
    /**
     * Constructor method
     * @param baseURL
     */
    constructor(baseURL) {
        this.instance = axios.create({
            baseURL: baseURL || `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}v1/`,
            //baseURL: 'http://back.cart2curb.ca/api',
            timeout: 30000
        })
    }

    /**
     * GET base method for api
     * @param url specific endpoint to fetch data
     * @param query endpoint query params
     * @param options fetch methods header configuration
     * @returns {Promise<unknown>}
     */
    get(url, query = {}, options = {}) {
        const params = new URLSearchParams(query)
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.get(`${url}?${params}`, options)
                resolve(res);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     * POST base method for api
     * @param url specific endpoint to send post request
     * @param body data that will send to server side
     * @param query endpoint query params
     * @param options fetch methods header configuration
     * @returns {Promise<unknown>}
     */
    post(url, body, query = {}, options = {}) {
        const params = new URLSearchParams(query)
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.post(`${url}?${params}`, body, options);
                resolve(res);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     * PUT base method for api
     * @param url specific endpoint to send put request
     * @param body data that will send to server side
     * @param query endpoint query params
     * @param options fetch methods header configuration
     * @returns {Promise<unknown>}
     */
    put(url, body, query = {}, options = {}) {
        const params = new URLSearchParams(query)
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.put(`${url}?${params}`, body, options);
                resolve(res);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     * DELETE base method for api
     * @param url specific endpoint to send delete request
     * @param options fetch methods header configuration
     * @returns {Promise<unknown>}
     */
    delete(url, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.delete(url, options);
                resolve(res);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     * Get auth token
     * @returns {string} Authorization token
     */
    token() {
        return localStorage.getItem('jwt_token');
    }

    /**
     * Check user is logged in or not
     * @returns {boolean|boolean}
     */
    checkAuthorized() {
        let token = this.token();
        return typeof token === 'string' && token.length > 0;
    }

    handleToLogin(type = "") {
        emitter.emit('change-route', {
            path: type ? `/${type}/login` : '/login',
        })
    }
}
