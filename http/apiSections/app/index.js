import ApiInstance from "../../instance";

export default class StoreApi extends ApiInstance {
    constructor() {
        super();

        this.methods = {
            stores: this.stores,
            store: this.store,
            category: this.category,
            products: this.products,
            product: this.product,
            videos: this.videos,
            contact: this.contact
        }
    }

    stores(query = {}) {
        return this.get('store', query)
    }

    store(storeId) {
        return this.get(`store/${storeId}`)
    }

    category({storeId, pageNumber, pageSize}) {
        return this.get(`category`, {
            storeId,
            page_number: pageNumber,
            page_size: pageSize
        })
    }

    products(query) {
        return this.get(`product`, query)
    }

    product(productId) {
        return this.get(`product/${productId}`)
    }

    videos(count = 2) {
        return this.get(`videos`, {
            page_size: count,
        })
    }

    contact(body) {
        return this.post('contact-us', body)
    }

}