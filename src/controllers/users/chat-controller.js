class Controller {
  constructor() {
    this.service = require("../../services/users/chat-service");
  }

  async getInbox(data) {
    return await this.service.getInbox(data);
  }

  async newChat(data) {
    return await this.service.newChat(data);
  }

  async getChats(data) {
    return await this.service.getChats(data);
  }

  async chatTyping(data) {
    return await this.service.chatTyping(data);
  }
}

module.exports = new Controller();
