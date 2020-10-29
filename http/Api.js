import CustomerAuthApi from "./apiSections/customer/auth";
import CustomerProfileApi from "./apiSections/customer/profile";
import StoreApi from "./apiSections/app";

export class Api {
    constructor() {
        this.customer = {
            auth: new CustomerAuthApi(),
            profile: new CustomerProfileApi(),
        }
        this.app = new StoreApi()

    }
}

const api = new Api();

export default api