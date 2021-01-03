import CustomerAuthApi from "./apiSections/customer/auth";
import CustomerProfileApi from "./apiSections/customer/profile";
import StoreApi from "./apiSections/app";
import VendorAuthApi from "./apiSections/vendor/auth";
import VendorProfileApi from "./apiSections/vendor/profile";
import VendorStoreApi from "./apiSections/vendor/store";
import CartApi from "./apiSections/cart";
import AdminStoreApi from "./apiSections/admin/store";
import AdminDeliveryApi from "./apiSections/admin/delivery";

export class Api {
    constructor(baseURL = false) {
        this.customer = {
            auth: new CustomerAuthApi(baseURL),
            profile: new CustomerProfileApi(baseURL),
        }
        this.app = new StoreApi(baseURL)
        this.vendor = {
            auth: new VendorAuthApi(baseURL),
            profile: new VendorProfileApi(baseURL),
            store: new VendorStoreApi(baseURL)
        }
        this.admin = {
            auth: new VendorAuthApi(baseURL),
            profile: new VendorProfileApi(baseURL),
            store: new AdminStoreApi(baseURL),
            user: new AdminStoreApi(baseURL),
            delivery: new AdminDeliveryApi(baseURL),
        }

        this.cart = new CartApi(baseURL);
    }
}

const api = new Api();

export default api