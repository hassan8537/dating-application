class Controller {
  constructor() {
    this.service = require("../../services/users/compliment-service");
  }

  async getMyCompliments(req, res) {
    await this.service.getMyCompliments(req, res);
  }

  async getCompliments(req, res) {
    await this.service.getCompliments(req, res);
  }

  async createCompliment(req, res) {
    await this.service.createCompliment(req, res);
  }
}

module.exports = new Controller();
