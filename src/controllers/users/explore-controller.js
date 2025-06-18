class Controller {
  constructor() {
    this.service = require("../../services/users/explore-service");
  }

  async getProfiles(req, res) {
    await this.service.getProfiles(req, res);
  }
}

module.exports = new Controller();
