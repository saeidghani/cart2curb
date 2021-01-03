import ApiInstance from "../../instance";

export default class AdminStoreApi extends ApiInstance {
    constructor() {
        super();
    }

    getOrders(query = {}, options = {}) {
        return this.get(`admin/orders`, query, options);
    }

    getStores(query = {}, options = {}) {
        return this.get(`admin/stores`, query, options);
    }

    getStoresRank(query = {}, options = {}) {
        return this.get(`admin/stores/rank`, query, options);
    }

    addStoreRank(body, {}, options = {}) {
        return this.post(`admin/stores/rank`, body, { }, options);
    }

    deleteStoreRank(storeId, options = {}) {
        return this.delete(`admin/stores/rank/${storeId}`, options);
    }

    getStore(storeId, options = {}) {
        return this.get(`admin/stores/${storeId}`, {}, options);
    }

    editStore(storeId, body, options = {}) {
        return this.put(`admin/stores/${storeId}`, body, {}, options);
    }

    getCategories(storeId, query = {}, options = {}) {
        return this.get(`admin/stores/${storeId}/categories`, query, options);
    }

    addCategory(storeId, body, options = {}) {
        return this.post(`admin/stores/${storeId}/categories`, body, {}, options);
    }

    editCategory(storeId, categoryId, body, options = {}) {
        return this.put(`admin/stores/${storeId}/categories/${categoryId}`, body, {}, options);
    }

    deleteCategory(storeId, categoryId, options = {}) {
        return this.delete(`admin/stores/${storeId}/categories/${categoryId}`, options);
    }

    getProducts(storeId, query = {}, options = {}) {
        return this.get(`admin/stores/${storeId}/products`, query, options);
    }

    addProduct(storeId, body, options = {}) {
        return this.post(`admin/stores/${storeId}/products`, body, {}, options);
    }

    getProduct(storeId, productId, options = {}) {
        return this.get(`admin/stores/${storeId}/products/${productId}`, {}, options);
    }

    editProduct(storeId, productId, body, options = {}) {
        return this.put(`admin/stores/${storeId}/products/${productId}`, body, {}, options);
    }

    deleteProduct(storeId, productId, options = {}) {
        return this.put(`admin/stores/${storeId}/products/${productId}`, options);
    }

    getServices(storeId, query = {}, options = {}) {
        return this.get(`admin/stores/${storeId}/services`, query, options);
    }

    addService(storeId, body, query = {}, options = {}) {
        return this.post(`admin/stores/${storeId}/services`, body,{}, options);
    }

    getService(storeId, serviceId, options = {}) {
        return this.get(`admin/stores/${storeId}/services/${serviceId}`, {}, options);
    }

    editService(storeId, serviceId, body, options = {}) {
        return this.put(`admin/stores/${storeId}/services/${serviceId}`, body,{}, options);
    }

    deleteService(storeId, serviceId, options = {}) {
        return this.delete(`admin/stores/${storeId}/services/${serviceId}`, options);
    }
}