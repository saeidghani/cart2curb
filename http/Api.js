import CustomerAuthApi from "./apiSections/customer/auth";
import CustomerProfileApi from "./apiSections/customer/profile";

export class Api {
    constructor() {
        this.customer = {
            auth: new CustomerAuthApi(),
            profile: new CustomerProfileApi()
        }
    }
}

const api = new Api();

export default api