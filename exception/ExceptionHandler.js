import errors from '../constants/errors.json';
import { message } from 'antd';

export const DEFAULT_HTTP_ERROR = 'An Error was occurred, Please try again'

export default class ExceptionHandler {
    throwError(response = {} , defaultError = DEFAULT_HTTP_ERROR) {
        if(!response || (response?.data?.errors?.length === 0) || !Array.isArray(response?.data?.errors)) {
            this.message(defaultError)

            return false;
        }

        const err = response?.data?.errors || [];
        for (let i in err) {
            const code = err[i].errorCode;

            this.message(errors[code].message);
        }

        return false;
    }

    message(text = DEFAULT_HTTP_ERROR) {
        if(document && message) {
            try {
                message.error(text);
            } catch(e) {
                return false;
            }
        }
    }
}