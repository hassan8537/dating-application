class Controller {
  constructor() {
    this.service = require("../../services/users/realtime-service");
  }

  async getRealTimeStatistics(req, res) {
    await this.service.getRealTimeStatistics(req, res);
  }

  async arrived(req, res) {
    await this.service.arrived(req, res);
  }

  async optOut(req, res) {
    await this.service.optOut(req, res);
  }
}

module.exports = new Controller();
