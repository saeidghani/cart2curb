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

  changePassword(body, options = {}) {
    return this.put('admin/auth/changepassword', body, {}, options);
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

  addRank(body, options = {}) {
    return this.post('admin/stores/rank', body, {}, options);
  }

  getVideos(query = {}, options = {}) {
    return this.get(`/videos`, query, options);
  }

  addVideo(body, options = {}) {
    return this.post('/videos', body, {}, options);
  }
}