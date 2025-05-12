class Controller {
  constructor() {
    this.service = require("../../services/users/setting-service");
  }

  async toggleNotifications(req, res) {
    await this.service.toggleNotifications(req, res);
  }

  async toggleAnonymousProfile(req, res) {
    return await this.service.toggleAnonymousProfile(req, res);
  }

  async togglePrivacy(req, res) {
    return await this.service.togglePrivacy(req, res);
  }

  async unsubscribe(req, res) {
    return await this.service.unsubscribe(req, res);
  }

  async upgradeSubscription(req, res) {
    return await this.service.upgradeSubscription(req, res);
  }

  async getBlockUsers(req, res) {
    return await this.service.getBlockUsers(req, res);
  }

  async toggleBlockUnblock(req, res) {
    return await this.service.toggleBlockUnblock(req, res);
  }

  async toggleHiddenFromUsers(req, res) {
    return await this.service.toggleHiddenFromUsers(req, res);
  }
}

module.exports = new Controller();
