class Controller {
  constructor() {
    this.service = require("../../services/users/otp-service");
  }

  async verifyOtp(req, res) {
    await this.service.verifyOtp(req, res);
  }

  async resendOtp(req, res) {
    await this.service.resendOtp(req, res);
  }
}

module.exports = new Controller();
