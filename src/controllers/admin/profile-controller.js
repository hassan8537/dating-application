class Controller {
  constructor() {
    this.service = require("../../services/admin/profile-service");
  }

  async getProfiles(req, res) {
    await this.service.getProfiles(req, res);
  }

  async updateProfile(req, res) {
    await this.service.updateProfile(req, res);
  }

  async deleteAccount(req, res) {
    await this.service.deleteAccount(req, res);
  }

  async changePassword(req, res) {
    await this.service.changePassword(req, res);
  }
}

module.exports = new Controller();
