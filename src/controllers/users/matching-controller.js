class Controller {
  constructor() {
    this.service = require("../../services/users/matching-service");
  }

  async getMatchingProfiles(req, res) {
    await this.service.getMatchingProfiles(req, res);
  }

  async swipeRightProfile(req, res) {
    await this.service.swipeRightProfile(req, res);
  }

  async superLikeProfile(req, res) {
    await this.service.superLikeProfile(req, res);
  }

  async swipeLeftProfile(req, res) {
    await this.service.swipeLeftProfile(req, res);
  }
}

module.exports = new Controller();
