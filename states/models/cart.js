import {api} from '../../lib/api';

export const cart = {
    state: {
        cart: {},
        guestId: null
    },
    reducers: {
        setCart: (state, payload) => {
            state.cart = payload.cart;
        },
        setGuestId: (state, payload) => {
            state.guestId = payload.guestId;
        }
    },
    effects: dispatch => ({
        async getCart(options) {

            try {
                const res = await api.get('cart', options);

                if(res.data.success) {
                    dispatch.cart.setCart({
                        cart: res.data.data
                    })

                    return res.data.data;
                }

                return false;
            } catch (e) {
                if(e.hasOwnProperty('response')) {
                    console.log(e.response.data);
                }
                console.log(e);

                return false;
            }
        },
        async addToCart(body) {
            try {
                const res = await api.post('cart/add', body);
                if(res.data.success) {
                    return res;
                }

                return false;
            } catch(e) {
                console.log(e);
                return e;
            }
        },
        async deleteFromCart(id) {
            try{
                const res = await api.post('cart/delete', {
                    id
                })
                if(res.data.success) {
                    return id;
                }
                return false;
            } catch(e) {
                console.log(e);
                return e;
            }
        },
        async updateCart(body) {
            try {
                const productsRes = await api.post('cart/update', {
                    products: [
                        ...body.products
                    ]
                })
                const noteRes = await api.post('cart/note', {
                    note: body.note
                })

                if(productsRes.data.success && noteRes.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                console.log(e);

                return false;
            }
        },
        async checkAddress(body) {
            try {
                const res = await api.post('cart/check-address', body);
                console.log(res);
                if(res.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                console.log(e);

                return false;
            }
        },
        async updateDelivery(body) {
            try {
                const productsRes = await api.post('cart/address', {
                    ...body.address
                })
                const noteRes = await api.post('cart/deliverytime/update', {
                    time: body.time
                })
                console.log(productsRes);
                if(productsRes.data.success && noteRes.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                console.log(e);

                return false;
            }
        },
        async getDeliveryTime(options) {

            try {
                const res = await api.get('cart/deliverytime', options);

                if(res.data.success) {
                    return res.data.data;
                }

                return false;
            } catch (e) {
                if(e.hasOwnProperty('response')) {
                    console.log(e.response.data);
                }
                console.log(e);

                return false;
            }
        },
    })
}