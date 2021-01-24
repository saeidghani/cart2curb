import ApiInstance from "../../instance";

export default class DriverStoreApi extends ApiInstance {
    constructor() {
        super();
    }

    getAvailableDeliveries(query = {}, options = {}) {
        return this.get(`driver/deliveries/available`, query, options);
    }

    getHistoryDeliveries(query = {}, options = {}) {
        return this.get(`driver/deliveries/history`, query, options);
    }

    getCurrentDeliveries(query = {}, options = {}) {
        return this.get(`driver/deliveries/currents`, query, options);
    }

    editDeliveryAvailable(deliveryId, body, options = {}) {
        return this.put(`driver/deliveries/available/${deliveryId}`, body, {}, options);
    }

    editDeliveryComplete(deliveryId, body, options = {}) {
        return this.put(`driver/deliveries/${deliveryId}/complete`, body, {}, options);
    }
}