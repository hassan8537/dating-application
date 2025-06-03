const User = require("../../models/User");
const UserCompliment = require("../../models/UserCompliment");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.userCompliment = UserCompliment;
  }

  async getMyCompliments(req, res) {
    try {
      const { user, query } = req;

      const filters = { receiverId: user._id };

      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const sort = query.sort || "-createdAt";

      return await pagination({
        res,
        table: "My compliments",
        model: this.userCompliment,
        filters,
        page,
        limit,
        sort,
        populate: "senderId receiverId"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getCompliments(req, res) {
    try {
      const { query } = req;

      const filters = {};

      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const sort = query.sort || "-createdAt";

      return await pagination({
        res,
        table: "My compliments",
        model: this.userCompliment,
        filters,
        page,
        limit,
        sort,
        populate: "senderId receiverId"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async createCompliment(req, res) {
    try {
      const { receiverId, compliment, description } = req.body;

      await this.userCompliment.create({
        senderId: req.user._id,
        compliment,
        description,
        receiverId
      });

      return handlers.response.success({
        res,
        message: "Compliment submitted"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
