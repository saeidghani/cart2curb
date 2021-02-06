import api from '../../../http/Api';
import {emitter} from "../../../helpers/emitter";

export const customCart = {
    state: {
        cart: {},
        cartChanges: 0,
        cartId: null
    },
    reducers: {
        setCart: (state, payload) => {
            state.cart = payload.cart;
            if(payload._id) {
                state.cartId = payload._id;
            }
        },
        changeCart: (state) => {
            state.cartChanges++;
        },
        setCartId: (state, payload) => {
            state.cartId = payload.cartId;
        }
    },
    effects: dispatch => ({
        async getCart(id = undefined, rootState) {
            try {
                const res = await api.vendor.customCart.getCart({}, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                });

                if(res?.data?.success) {
                    if(res?.data?.data?.length > 0) {
                        let cart;
                        if(id) {
                            cart = res?.data?.data.find(cart => cart._id === id);
                            dispatch.customCart.setCart({
                                cart: cart,
                                _id: id,
                            })
                        } else  {
                            cart = res?.data?.data?.[0];
                            dispatch.customCart.setCart({
                                cart: cart,
                                _id: cart._id,
                            })
                        }
                        return cart || {}
                    } else {
                        dispatch.customCart.setCart({
                            cart: {},
                            _id: null,
                        })

                        return {};
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        async createCart(body = {}, rootState) {
            try {
                const res = await api.vendor.customCart.createCart(body, {
                    headers: {
                        Authorization: `Bearer ${rootState.vendorAuth.token}`
                    }
                })

                if(res?.data?.success) {
                    dispatch.customCart.setCart({
                        cart: {},
                        _id: res?.data?.data?._id,
                    })
                    return res?.data?.data?._id;
                }

                return false;
            } catch(e) {
                return false;
            }
        },
        async addToCart(body, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.addToCart(cartId, body, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    })

                    if(res?.data?.success) {
                        emitter.emit('show-message', {
                            type: 'success',
                            text: "Product added to cart"
                        })

                        return cartId;
                    }
                    return false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }

            } catch(e) {
                return false;
            }
        },
        async deleteFromCart(id, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.deleteProduct(cartId, id, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    })

                    if(res?.data?.success) {
                        return cartId;
                    }
                    return false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async updateCart(body, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    let canResume = true;
                    for(let i in body.products) {
                        if(canResume) {
                            const res = await api.vendor.customCart.updateProduct(cartId, i, {
                                ...body.products[i],
                            }, {
                                headers: {
                                    Authorization: `Bearer ${rootState.vendorAuth.token}`
                                }
                            })
                            if(!res?.data?.success) {
                                canResume = false;
                            }
                        } else {
                            break;
                        }
                    }

                    if(canResume) {
                        const res = await api.vendor.customCart.addNote(cartId, {
                            note: body.note,
                        }, {
                            headers: {
                                Authorization: `Bearer ${rootState.vendorAuth.token}`
                            }
                        })

                        if(res?.data?.success) {
                            return true;
                        }
                    }

                    return false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch (e) {
                return false;
            }
        },
        async addCustomerInfo(body, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.addCustomerInfo(cartId, body, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    });

                    return res?.data?.success ? true : false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async addAddress(body, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.addAddress(cartId, body, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    });

                    return res?.data?.success ? true : false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async updateDeliveryTime(body, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.updateDeliveryTime(cartId, body, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    });

                    return res?.data?.success ? true : false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch(e) {
                return false;
            }
        },
        async submit(args = undefined, rootState) {
            try {
                const cartId = rootState.customCart.cartId;
                if(cartId) {
                    const res = await api.vendor.customCart.submit(cartId, {
                        headers: {
                            Authorization: `Bearer ${rootState.vendorAuth.token}`
                        }
                    });

                    if(res?.data?.success) {
                        dispatch.customCart.setCart({
                            cart: {},
                            _id: null,
                        })
                        return true;
                    }
                    return false;
                } else {
                    emitter.emit('show-message', {
                        type: 'error',
                        text: 'Please create a new Order first!'
                    })
                    return false;
                }
            } catch(e) {
                return false;
            }
        }
    })
}