class Controller {
  constructor() {
    this.service = require("../../services/users/share-service");
  }

  async manageEventShares(req, res) {
    await this.service.manageEventShares(req, res);
  }

  async getEventShares(req, res) {
    await this.service.getEventShares(req, res);
  }
}

module.exports = new Controller();
