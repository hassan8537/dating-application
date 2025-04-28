class Controller {
  constructor() {
    this.service = require("../../services/users/event-service");
  }

  async getEvents(req, res) {
    await this.service.getEvents(req, res);
  }

  async createEvent(req, res) {
    await this.service.createEvent(req, res);
  }

  async updateEvent(req, res) {
    await this.service.updateEvent(req, res);
  }

  async deleteEvent(req, res) {
    await this.service.deleteEvent(req, res);
  }

  async joinEvent(req, res) {
    await this.service.joinEvent(req, res);
  }

  async inviteMember(req, res) {
    await this.service.inviteMember(req, res);
  }

  async getEventComments(req, res) {}
}

module.exports = new Controller();
