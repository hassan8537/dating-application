class Controller {
  constructor() {
    this.service = require("../../services/users/profile-service");
  }

  async getMyProfile(req, res) {
    await this.service.getMyProfile(req, res);
  }

  async createProfile(req, res) {
    await this.service.createProfile(req, res);
  }

  async createAvatar(req, res) {
    await this.service.createAvatar(req, res);
  }

  async setGender(req, res) {
    await this.service.setGender(req, res);
  }

  async setRelationship(req, res) {
    await this.service.setRelationship(req, res);
  }

  async setFeelings(req, res) {
    await this.service.setFeelings(req, res);
  }

  async uploadYourPhotosAndVideos(req, res) {
    await this.service.uploadYourPhotosAndVideos(req, res);
  }

  async addYourInterests(req, res) {
    await this.service.addYourInterests(req, res);
  }

  async addYourHobbies(req, res) {
    await this.service.addYourHobbies(req, res);
  }

  async addYourProfessions(req, res) {
    await this.service.addYourProfessions(req, res);
  }

  async uploadCertificates(req, res) {
    await this.service.uploadCertificates(req, res);
  }

  async setSos(req, res) {
    await this.service.setSos(req, res);
  }

  async subscribeNow(req, res) {
    await this.service.subscribeNow(req, res);
  }

  async editProfile(req, res) {
    await this.service.editProfile(req, res);
  }

  async deleteAccount(req, res) {
    await this.service.deleteAccount(req, res);
  }

  async changePassword(req, res) {
    await this.service.changePassword(req, res);
  }

  async signOut(req, res) {
    await this.service.signOut(req, res);
  }

  async visitProfile(req, res) {
    await this.service.visitProfile(req, res);
  }
}

module.exports = new Controller();
