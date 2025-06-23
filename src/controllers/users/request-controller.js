class Controller {
  constructor() {
    this.service = require("../../services/users/request-service");
  }

  async getCurrentFriendRequests(req, res) {
    return await this.service.getCurrentFriendRequests(req, res);
  }

  async getPendingFriendRequests(req, res) {
    return await this.service.getPendingFriendRequests(req, res);
  }

  async acceptFriendRequest(req, res) {
    return await this.service.acceptFriendRequest(req, res);
  }

  async rejectFriendRequest(req, res) {
    return await this.service.rejectFriendRequest(req, res);
  }
}

module.exports = new Controller();
