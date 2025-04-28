class Controller {
  constructor() {
    this.service = require("../../services/users/social-service");
  }

  async toggleFollowUser(req, res) {
    await this.service.toggleFollowUser(req, res);
  }

  async getFollowers(req, res) {
    return await this.service.getFollowers(req, res);
  }

  async getFollowing(req, res) {
    return await this.service.getFollowing(req, res);
  }

  async getFriends(req, res) {
    return await this.service.getFriends(req, res);
  }
}

module.exports = new Controller();
