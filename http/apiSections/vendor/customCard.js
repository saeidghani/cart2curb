import ApiInstance from "../../instanceWithException";

export default class CustomCardApi extends ApiInstance {
    constructor() {
        super();

        this.methods = {
            profile: {
                get: this.profile,
                update: this.updateProfile,
            },
        }
    }

    categories(query = {}, options = {}) {
        return this.get('vendor/store/categories', query, options)
    }

    addCategory(body, options = {}) {
        return this.post('vendor/store/categories', body, {}, options)
    }

    singleCategory(id, options = {}) {
        return this.get(`vendor/store/categories/${id}`, {}, options);
    }

    editCategory(id, body, options = {}) {
        return this.put(`vendor/store/categories/${id}`, body, {}, options);
    }

    deleteCategory(id, options = {}) {
        return this.delete(`vendor/store/categories/${id}`, options);
    }

    products(query = {}, options = {}) {
        return this.get('vendor/store/products', query, options);
    }

    addProduct(body, options = {}) {
        return this.post('vendor/store/products', body, {}, options)
    }

    singleProduct(id, options = {}) {
        return this.get(`vendor/store/products/${id}`,{}, options)
    }

    editProduct(id, body, options = {}) {
        return this.put(`vendor/store/products/${id}`, body, {}, options);
    }

    deleteProduct(id, options = {}) {
        return this.delete(`vendor/store/products/${id}`, options);
    }

    orders(query = {}, options = {}) {
        return this.get('vendor/store/orders', query, options);
    }

    singleOrder(id = '', options = {}) {
        return this.get(`vendor/store/orders/${id}`, {}, options);
    }

}