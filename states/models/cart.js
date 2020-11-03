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
                    ...body.products
                })
                const noteRes = await api.post('cart/note', {
                    ...body.note
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
        }
    })
}