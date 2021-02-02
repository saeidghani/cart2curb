import {getApi} from '../../lib/api';
import {message} from "antd";

const api = getApi();

export const cart = {
    state: {
        cart: {},
        cartChanges: 0,
        guestId: null
    },
    reducers: {
        setCart: (state, payload) => {
            state.cart = payload.cart;
        },
        changeCart: (state) => {
            state.cartChanges++;
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
                return false;
            }
        },
        async getClientCart(query, rootState) {
            try {
                const token = rootState.auth.token;
                const options = {
                    headers: {}
                }
                if(token) {
                    options.headers.Authorization = `Bearer ${token}`
                }
                const res = await api.get('cart', options);

                if(res.data.success) {
                    dispatch.cart.setCart({
                        cart: res.data.data
                    })

                    return res.data.data;
                }

                return false;
            } catch (e) {
                return false;
            }
        },
        async addToCart(body) {
            try {
                const res = await api.post('cart/add', body);
                if(res.data.success) {
                    dispatch.cart.changeCart();
                    return res;
                }

                return false;
            } catch(e) {
                return false;
            }
        },
        async deleteFromCart(id) {
            try{
                const res = await api.post('cart/delete', {
                    id
                })
                if(res.data.success) {
                    dispatch.cart.changeCart();
                    return id;
                }
                return false;
            } catch(e) {
                return false;
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
                    dispatch.cart.changeCart();
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async checkAddress(body) {
            try {
                const res = await api.post('cart/check-address', body);
                if(res.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
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
                if(productsRes.data.success && noteRes.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
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
                return false;
            }
        },
        async promoTip(body) {
            try {
                const res = await api.post('cart/promotip', body);
                if(res.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async checkout(body) {
            try {
                const res = await api.post('cart/checkout', body);
                if(res.data.success) {
                    return res.data.data.clientSecret;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async confirmCheckout(body) {
            try {
                const res = await api.post('cart/checkout/confirm', body);
                if(res.data.success) {
                    dispatch.cart.changeCart();
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async guestInfo(body) {
            try {
                const res = await api.post('cart/guest-info', body);
                if(res.data.success) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        }
    })
}