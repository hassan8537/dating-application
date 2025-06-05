const { handlers } = require("../../utilities/handlers/handlers");

class Controller {
  constructor() {
    this.service = require("../../services/users/reel-service");
  }

  async createReel(req, res) {
    return await this.service.createReel(req, res);
  }

  async getMyReels(req, res) {
    return await this.service.getMyReels(req, res);
  }

  async getReels(req, res) {
    return await this.service.getReels(req, res);
  }

  async getReelById(req, res) {
    return await this.service.getReelById(req, res);
  }

  async updateReel(req, res) {
    return await this.service.updateReel(req, res);
  }

  async deleteReel(req, res) {
    return await this.service.deleteReel(req, res);
  }

  async toggleSaveReel(req, res) {
    return await this.service.toggleSaveReel(req, res);
  }

  async getSavedReels(req, res) {
    return await this.service.getSavedReels(req, res);
  }

  async toggleLikeReel(req, res) {
    return await this.service.toggleLikeReel(req, res);
  }

  async getLikedReels(req, res) {
    return await this.service.getLikedReels(req, res);
  }

  async shareReel(req, res) {
    return await this.service.shareReel(req, res);
  }

  async postAComment(req, res) {
    return await this.service.postAComment(req, res);
  }

  async getComments(req, res) {
    return await this.service.getComments(req, res);
  }

  async deleteAComment(req, res) {
    return await this.service.deleteAComment(req, res);
  }

  async postAReply(req, res) {
    return await this.service.postAReply(req, res);
  }

  async getReplies(req, res) {
    return await this.service.getReplies(req, res);
  }

  async deleteAReply(req, res) {
    return await this.service.deleteAReply(req, res);
  }
}

module.exports = new Controller();
