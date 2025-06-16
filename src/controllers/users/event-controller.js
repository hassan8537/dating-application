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

  async getJoinedEvents(req, res) {
    await this.service.getJoinedEvents(req, res);
  }

  async joinEvent(req, res) {
    await this.service.joinEvent(req, res);
  }

  async sendEventInvitation(req, res) {
    await this.service.sendEventInvitation(req, res);
  }

  async getEventInvitedUsers(req, res) {
    await this.service.getEventInvitedUsers(req, res);
  }
}

module.exports = new Controller();
