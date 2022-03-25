import errors from '../constants/errors.json';
import { emitter } from "../helpers/emitter";

export const DEFAULT_HTTP_ERROR = 'An error occurred, please try again.'

export default class ExceptionHandler {
    throwError(response = {} , defaultError = DEFAULT_HTTP_ERROR) {
        if(!response || (response?.data?.errors?.length === 0) || !Array.isArray(response?.data?.errors)) {
            this.message(defaultError)

            return false;
        }

        const err = response?.data?.errors || [];
        for (let i in err) {
            const code = err[i].errorCode;
            const defaultMessage = err[i].message

            this.message(defaultMessage || errors[code].message);
        }

        return false;
    }

    message(text = DEFAULT_HTTP_ERROR) {
        try {
            emitter.emit('show-message', {
                type: 'error',
                text
            })
        } catch(e) {
            return false;
        }
    }
}