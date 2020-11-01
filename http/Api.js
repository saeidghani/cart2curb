import CustomerAuthApi from "./apiSections/customer/auth";
import CustomerProfileApi from "./apiSections/customer/profile";
import StoreApi from "./apiSections/app";
import VendorAuthApi from "./apiSections/vendor/auth";
import VendorProfileApi from "./apiSections/vendor/profile";
import VendorStoreApi from "./apiSections/vendor/store";
import CartApi from "./apiSections/cart";

export class Api {
    constructor() {
        this.customer = {
            auth: new CustomerAuthApi(),
            profile: new CustomerProfileApi(),
        }
        this.app = new StoreApi()
        this.vendor = {
            auth: new VendorAuthApi(),
            profile: new VendorProfileApi(),
            store: new VendorStoreApi()
        }

        this.cart = new CartApi();
    }
}

const api = new Api();

export default api