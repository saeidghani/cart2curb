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
        return this.get('cart', {}, options);
    }

    addToCart(body, options = {}) {
        return this.post('cart', body, {}, options);
    }

    editCart(body, options = {}) {
        return this.put('cart', body, {}, options)
    }

    deleteFromCart(id, options = {}) {
        return this.delete(`cart/product/${id}`, options);
    }

    addNote(body, options = {}) {
        return this.put(`cart/note`, body, {}, options);
    }

    guestInfo(body, options = {}) {
        return this.put('cart/guest', body, {}, options);
    }

    checkAddress(body, options = {}) {
        return this.post('cart/check-address', body, {}, options);
    }

    address(body, options = {}) {
        return this.put('cart/address', body, {}, options);
    }

    deliveryTime(options = {}) {
        return this.get('cart/deliverytime', {}, options);
    }

    setDeliveryTime(body, options = {}) {
        return this.put('cart/deliverytime', body, {}, options);
    }

    promoTip(body, options = {}) {
        return this.put('cart/promotip', body, {}, options);
    }

    checkout(body, options = {}) {
        return this.post('cart/checkout', body, {}, options);
    }

    confirmCheckout(body, options = {}) {
        return this.post('cart/confirm-checkout', body, {}, options);
    }
}