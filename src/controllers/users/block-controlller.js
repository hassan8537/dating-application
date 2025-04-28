class Controller {
  constructor() {
    this.service = require("../../services/users/block-service");
  }

  async getBlockedUsers(req, res) {
    await this.service.getBlockedUsers(req, res);
  }

  async toggleBlockUnblockUser(req, res) {
    await this.service.toggleBlockUnblockUser(req, res);
  }
}

module.exports = new Controller();
