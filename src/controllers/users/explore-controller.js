class Controller {
  constructor() {
    this.service = require("../../services/users/explore-service");
  }

  async profilesLikedMe(req, res) {
    await this.service.profilesLikedMe(req, res);
  }

  async profilesVisitedMe(req, res) {
    await this.service.profilesVisitedMe(req, res);
  }

  async favouriteProfiles(req, res) {
    await this.service.favouriteProfiles(req, res);
  }

  async profilesIPassed(req, res) {
    await this.service.profilesIPassed(req, res);
  }

  async profilesILiked(req, res) {
    await this.service.profilesILiked(req, res);
  }
}

module.exports = new Controller();
