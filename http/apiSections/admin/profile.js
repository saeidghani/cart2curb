import ApiInstance from "../../instance";

export default class AdminProfileApi extends ApiInstance {
  constructor() {
    super();
  };

  getProfile(options = {}) {
    return this.get('admin/profile', {}, options);
  }

  editProfile(body, options = {}) {
    return this.put('admin/profile', body, {}, options);
  }

  getPromos(query = {}, options = {}) {
    return this.get('/promo', query, options);
  }

  deletePromo(promoId, options = {}) {
    return this.delete(`/promo/${promoId}`, options);
  }

  addPromo(body, options = {}) {
    return this.post('/promo/', body, {}, options);
  }

  getPromo(promoId, options = {}) {
    return this.get(`promo/${promoId}`, {}, options);
  }

  editPromo(promoId, body, options = {}) {
    return this.put(`promo/${promoId}`, body, {}, options);
  }

  getSystemConfig(options = {}) {
    return this.get(`/system-config`, {}, options);
  }

  editSystemConfig(body, options = {}) {
    return this.put(`/system-config`, body, {}, options);
  }

  getCustomerMessages(query = {}, options = {}) {
    return this.get('/contact-us', query, options);
  }
}