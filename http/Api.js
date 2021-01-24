import CustomerAuthApi from "./apiSections/customer/auth";
import CustomerProfileApi from "./apiSections/customer/profile";
import StoreApi from "./apiSections/app";
import VendorAuthApi from "./apiSections/vendor/auth";
import VendorProfileApi from "./apiSections/vendor/profile";
import VendorStoreApi from "./apiSections/vendor/store";
import CartApi from "./apiSections/cart";
import AdminUserApi from "./apiSections/admin/user";
import AdminStoreApi from "./apiSections/admin/store";
import AdminDeliveryApi from "./apiSections/admin/delivery";
import AdminProfileApi from "./apiSections/admin/profile";
import AdminAuthApi from "./apiSections/admin/auth";
import DriverAuthApi from "./apiSections/driver/auth";
import DriverProfileApi from "./apiSections/driver/profile";
import DriverDeliveryApi from "./apiSections/driver/delivery";

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
            profile: new AdminProfileApi(baseURL),
            store: new AdminStoreApi(baseURL),
            user: new AdminUserApi(baseURL),
            auth: new AdminAuthApi(baseURL),
            delivery: new AdminDeliveryApi(baseURL),
        },
        this.driver = {
            auth: new DriverAuthApi(baseURL),
            profile: new DriverProfileApi(baseURL),
            delivery: new DriverDeliveryApi(baseURL),
        },
        this.cart = new CartApi(baseURL);
    }
}

const api = new Api();

export default api