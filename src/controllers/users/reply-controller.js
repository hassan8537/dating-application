class Controller {
  constructor() {
    this.service = require("../../services/users/reply-service");
  }

  async getReplies(req, res) {
    await this.service.getReplies(req, res);
  }

  async createReply(req, res) {
    await this.service.createReply(req, res);
  }

  async updateReply(req, res) {
    await this.service.updateReply(req, res);
  }

  async deleteReply(req, res) {
    await this.service.deleteReply(req, res);
  }

  async manageReplyLikes(data) {
    return await this.service.manageReplyLikes(data);
  }
}

module.exports = new Controller();
