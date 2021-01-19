import ApiInstance from "../../instance";

export default class AdminProfileApi extends ApiInstance {
  constructor() {
    super();
  };

  getProfile(options = {}) {
    return this.get('admin/profile', {}, options);
  }
}