class Controller {
  constructor() {
    this.service = require("../../services/users/toggle-service");
  }

  async toggleNotifications(req, res) {
    await this.service.toggleNotifications(req, res);
  }

  async togglePrivacy(req, res) {
    await this.service.togglePrivacy(req, res);
  }
}

module.exports = new Controller();
