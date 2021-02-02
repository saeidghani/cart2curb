import ApiInstance from "./instance";
import ExceptionHandler from "../exception/ExceptionHandler";

export default class ApiInstanceWithException extends ApiInstance {
    /**
     * Constructor method
     * @param baseURL
     */
    constructor(baseURL) {
        super();

        this.exceptionHandler = new ExceptionHandler();

        this.instance.interceptors.response.use((res) => {
            return res;
        }, error => {
            this.exceptionHandler.throwError(error.response);

            return Promise.reject(error);
        })

    }
}