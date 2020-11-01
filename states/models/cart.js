import api from '../../http/Api';

export const cart = {
    state: {
        cart: {

        },
        note: '',
        address: {},
        deliveryTime: '',
    },
    reducers: {
        setCart: (state, payload) => {
            state.cart = payload.cart;
        },
        setNote: (state, payload) => {
            state.note = payload.note;
        },
        setAddress: (state, payload) => {
            state.address = payload.address;
        },
        setDeliveryTime: (state, payload) => {
            state.deliveryTime = payload.deliveryTime;
        }
    },
    effects: dispatch => ({

    })
}