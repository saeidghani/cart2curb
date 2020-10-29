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
            videos: this.videos
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

    products({ storeId, pageNumber, pageSize, category, sort }) {
        return this.get(`product`, {
            storeId,
            page_number: pageNumber,
            page_size: pageSize,
            category,
            sort,
        })
    }

    product(productId) {
        return this.get(`product/${productId}`)
    }

    videos() {
        return this.get('videos')
    }

}