import ApiInstance from "../../instance";

export default class AdminStoreApi extends ApiInstance {
    constructor() {
        super();
    }

    getDeliveries(query = {}, options = {}) {
        return this.get(`admin/deliveries`, query, options);
    }

    editDelivery(deliveryId, body, options = {}) {
        return this.put(`admin/deliveries/${deliveryId}`, body, {}, options);
    }

    editDeliveryComplete(deliveryId, body, options = {}) {
        return this.put(`admin/deliveries/${deliveryId}/complete`, body, {}, options);
    }

    editDeliveryUnassign(deliveryId, body, options = {}) {
        return this.put(`admin/deliveries/${deliveryId}/unassign`, body, {}, options);
    }
}