class Controller {
  constructor() {
    this.service = require("../../services/users/agora-service");
  }

  async getAgoraAccessToken(req, res) {
    return await this.service.getAgoraAccessToken(req, res);
  }
}

module.exports = new Controller();
