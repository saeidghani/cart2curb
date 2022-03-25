import axios from 'axios';
import ExceptionHandler from "../exception/ExceptionHandler";

const exceptionHandler = new ExceptionHandler();

export const getApi = (disableExceptionHandler = false) => {

    const api = axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}api/`,
        timeout: 30000,
    })

    if(!disableExceptionHandler) {
        api.interceptors.response.use(res => {
            return res;
        }, error => {
            exceptionHandler.throwError(error?.response);

            return Promise.reject(error);
        })
    }

    return api;
}