class Controller {
  constructor() {
    this.service = require("../../services/users/chat-service");
  }

  async getInbox(req, res) {
    await this.service.getInbox(req, res);
  }

  async newChat(data) {
    return await this.service.newChat(data);
  }

  async getChats(data) {
    return await this.service.getChats(data);
  }
}

module.exports = new Controller();
