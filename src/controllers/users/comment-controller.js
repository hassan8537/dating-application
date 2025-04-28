class Controller {
  constructor() {
    this.service = require("../../services/users/comment-service");
  }

  async getComments(req, res) {
    await this.service.getComments(req, res);
  }

  async createComment(req, res) {
    await this.service.createComment(req, res);
  }

  async updateComment(req, res) {
    await this.service.updateComment(req, res);
  }

  async deleteComment(req, res) {
    await this.service.deleteComment(req, res);
  }

  async manageCommentLikes(data) {
    return await this.service.manageCommentLikes(data);
  }
}

module.exports = new Controller();
