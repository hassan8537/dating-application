class Controller {
  constructor() {
    this.service = require("../../services/users/request-service");
  }

  async getFriendRequests(req, res) {
    return await this.service.getFriendRequests(req, res);
  }

  async getMatchRequests(req, res) {
    return await this.service.getMatchRequests(req, res);
  }
}

module.exports = new Controller();
