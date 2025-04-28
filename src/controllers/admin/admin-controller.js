class Controller {
  constructor() {
    this.service = require("../../services/admin/auth-service");
  }

  async signIn(req, res) {
    await this.service.signIn(req, res);
  }
}

module.exports = new Controller();
