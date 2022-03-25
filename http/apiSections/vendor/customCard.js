import ApiInstance from "../../instanceWithException";

export default class CustomCardApi extends ApiInstance {
    constructor() {
        super();
    }

    getCart(query = {}, options = {}) {
        return this.get('custom-cart', query, options)
    }

    createCart(body = {}, options = {}) {
        return this.post('custom-cart', body, {}, options)
    }

    deleteCart(id, options = {}) {
        return this.delete(`custom-cart/${id}`, options);
    }

    addToCart(id, body, options = {}) {
        return this.post(`custom-cart/${id}/products`, body, {}, options)
    }

    updateProduct(id, productId, body, options = {}) {
        return this.put(`custom-cart/${id}/products/${productId}`, body, {}, options)
    }

    deleteProduct(id, productId, options = {}) {
        return this.delete(`custom-cart/${id}/products/${productId}`, options);
    }


    addNote(id, body, options = {}) {
        return this.put(`custom-cart/${id}/note`, body, {}, options)
    }

    addAddress(id, body, options = {}) {
        return this.put(`custom-cart/${id}/address`, body, {}, options)
    }
    addCustomerInfo(id, body, options = {}) {
        return this.put(`custom-cart/${id}/customer-info`, body, {}, options)
    }

    updateDeliveryTime(id, body, options = {}) {
        return this.put(`custom-cart/${id}/deliverytime`, body, {}, options)
    }

    submit(id, options = {}) {
        return this.put(`custom-cart/${id}/submit`, {}, {}, options)
    }
}