import ApiInstance from "../../instance";

export default class AdminUserApi extends ApiInstance {
    constructor() {
        super();
    }

    getDrivers(query = {}, options = {}) {
        return this.get(`admin/users/drivers`, query, options);
    }

    addDriver(body, options = {}) {
        return this.post(`admin/users/drivers`, body, { }, options);
    }

    getDriver(driverId, options = {}) {
        return this.get(`admin/users/drivers/${driverId}`, {}, options);
    }

    editDriver(driverId, body, options = {}) {
        return this.put(`admin/users/drivers/${driverId}`, body, {}, options);
    }

    getPendingDrivers(query = {}, options = {}) {
        return this.get(`admin/users/drivers/pending`, query, options);
    }

    getPendingDriversCount(query = {}, options = {}) {
        return this.get(`admin/users/drivers/pending-count`, query, options);
    }

    getDriversApproved(query = {}, options = {}) {
        return this.get(`admin/users/drivers/approved`, query, options);
    }

    addPendingDriver(driverId, body, options = {}) {
        return this.post(`admin/users/drivers/pending/${driverId}`, body, { }, options);
    }

    getVendors(query = {}, options = {}) {
        return this.get(`admin/users/vendors`, query, options);
    }

    addVendor(body, options = {}) {
        return this.post(`admin/users/vendors`, body, { }, options);
    }

    getVendor(vendorId, options = {}) {
        return this.get(`admin/users/vendors/${vendorId}`, {}, options);
    }

    editVendor(vendorId, body, options = {}) {
        return this.put(`admin/users/vendors/${vendorId}`, body, {}, options);
    }

    getPendingVendors(query = {}, options = {}) {
        return this.get(`admin/users/vendors/pending`, query, options);
    }

    getPendingVendorsCount(query = {}, options = {}) {
        return this.get(`admin/users/vendors/pending-count`, query, options);
    }

    addPendingVendor(vendorId, body, options = {}) {
        return this.post(`admin/users/vendors/pending/${vendorId}`, body, { }, options);
    }

    getCustomers(query = {}, options = {}) {
        return this.get(`admin/users/customer`, query, options);
    }

    addCustomer(body, options = {}) {
        return this.post(`admin/users/customer`, body, {}, options);
    }

    getCustomer(customerId, options = {}) {
        return this.get(`admin/users/customer/${customerId}`, {}, options);
    }

    editCustomer(customerId, body, options = {}) {
        return this.put(`admin/users/customer/${customerId}`, body, {}, options);
    }

    editCustomerBlock(customerId, body, options = {}) {
        return this.put(`admin/users/customer/${customerId}/block`, body, {}, options);
    }

    editCustomerUnBlock(customerId, body, options = {}) {
        return this.put(`admin/users/customer/${customerId}/unblock`, body, {}, options);
    }

}