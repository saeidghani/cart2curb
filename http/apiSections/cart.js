import Instance from "../instance";

export default class CartApi extends Instance {
    constructor() {
        super();

        this.methods = {
            cart: {
                get: this.cart,
                add: this.addToCart,
                edit: this.editCart,
                deleteItem: this.deleteFromCart
            },
            addNote: this.addNote,
            guestInfo: this.guestInfo,
            checkAddress: this.checkAddress,
            address: this.address,
            deliveryTime: {
                get: this.deliveryTime,
                set: this.setDeliveryTime,
            },
            promoTip: this.promoTip,
            checkout: this.checkout,
            confirmCheckout: this.confirmCheckout
        }
    }

    cart(options = {}) {
        return this.get('cart', {}, {
            ...options,
            withCredentials: true,
        });
    }

    addToCart(body, options = {}) {
        return this.post('cart', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    editCart(body, options = {}) {
        return this.put('cart', body, {}, {
            ...options,
            withCredentials: true,
        })
    }

    deleteFromCart(id, options = {}) {
        return this.delete(`cart/product/${id}`, {
            ...options,
            withCredentials: true,
        });
    }

    addNote(body, options = {}) {
        return this.put(`cart/note`, body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    guestInfo(body, options = {}) {
        return this.put('cart/guest-info', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    checkAddress(body, options = {}) {
        return this.post('cart/check-address', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    address(body, options = {}) {
        return this.put('cart/address', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    deliveryTime(options = {}) {
        return this.get('cart/deliverytime', {}, {
            ...options,
            withCredentials: true,
        });
    }

    setDeliveryTime(body, options = {}) {
        return this.put('cart/deliverytime', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    promoTip(body, options = {}) {
        return this.put('cart/promotip', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    checkout(body, options = {}) {
        return this.post('cart/confirm', body, {}, {
            ...options,
            withCredentials: true,
        });
    }

    confirmCheckout(body, options = {}) {
        return this.post('cart/confirm-checkout', body, {}, {
            ...options,
            withCredentials: true,
        });
    }
}