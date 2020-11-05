import axios from 'axios';

export const api = axios.create({
    baseURL: `http://165.227.34.172:3002/api/`,
    timeout: 30000,
})