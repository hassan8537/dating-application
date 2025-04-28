class Controller {
  constructor() {
    this.service = require("../../services/users/like-service");
  }

  async manageCommentLikes(req, res) {
    await this.service.manageCommentLikes(req, res);
  }

  async manageReplyLikes(req, res) {
    await this.service.manageReplyLikes(req, res);
  }

  async manageEventLikes(req, res) {
    await this.service.manageEventLikes(req, res);
  }

  async getCommentLikes(req, res) {
    await this.service.getCommentLikes(req, res);
  }

  async getReplyLikes(req, res) {
    await this.service.getReplyLikes(req, res);
  }

  async getEventLikes(req, res) {
    await this.service.getEventLikes(req, res);
  }
}

module.exports = new Controller();
