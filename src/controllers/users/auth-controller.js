class Controller {
  constructor() {
    this.service = require("../../services/users/auth-service");
  }

  async signUpOrSignIn(req, res) {
    return await this.service.signUpOrSignIn(req, res);
  }

  async socialSignUpOrSignIn(req, res) {
    return await this.service.socialSignUpOrSignIn(req, res);
  }
}

module.exports = new Controller();
