import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LOCAL_BASE_URL,
    timeout: 30000,
})