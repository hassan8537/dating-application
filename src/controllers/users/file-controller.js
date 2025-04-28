class Controller {
  constructor() {
    this.service = require("../../services/users/file-service");
  }

  async getFiles(req, res) {
    await this.service.getFiles(req, res);
  }

  async createFile(req, res) {
    await this.service.createFile(req, res);
  }

  async deleteFile(req, res) {
    await this.service.deleteFile(req, res);
  }
}

module.exports = new Controller();
