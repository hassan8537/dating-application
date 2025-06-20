class Controller {
  constructor() {
    this.service = require("../../services/users/friend-service");
  }

  async getMyFriends(req, res) {
    return await this.service.getMyFriends(req, res);
  }
}

module.exports = new Controller();
