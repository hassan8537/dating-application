class Controller {
  constructor() {
    this.service = require("../../services/users/report-service");
  }

  async getReports(req, res) {
    await this.service.getReports(req, res);
  }

  async createReport(req, res) {
    await this.service.createReport(req, res);
  }

  async deleteReport(req, res) {
    await this.service.deleteReport(req, res);
  }
}

module.exports = new Controller();
