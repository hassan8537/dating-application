class Controller {
  constructor() {
    this.service = require("../../services/users/story-service");
  }

  async createStory(req, res) {
    return await this.service.createStory(req, res);
  }

  async getStories(req, res) {
    return await this.service.getStories(req, res);
  }

  async getStoryById(req, res) {
    return await this.service.getStoryById(req, res);
  }

  async deleteStory(req, res) {
    return await this.service.deleteStory(req, res);
  }
}

module.exports = new Controller();
