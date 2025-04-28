class Controller {
  constructor() {
    this.service = require("../../services/users/subscription-service");
  }

  async subscribeNow(req, res) {
    await this.service.subscribeNow(req, res);
  }
}

module.exports = new Controller();
