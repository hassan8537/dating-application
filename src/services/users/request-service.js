const Friends = require("../../models/Friend");
const Request = require("../../models/Request");
const User = require("../../models/User");
const requestSchema = require("../../schemas/request-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.friends = Friends;
    this.request = Request;
  }

  async getFriendRequests(req, res) {
    try {
      const user = req.user;

      const { page, limit, status } = req.query;

      const filters = { userId: user._id, type: "friend" };

      if (status) filters.status = status;

      return await pagination({
        res: res,
        table: "Friend requests",
        model: this.request,
        page: page,
        limit: limit,
        filters: filters,
        populate: requestSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getMatchRequests(req, res) {
    try {
      const user = req.user;

      const { page, limit, status } = req.query;

      const filters = { userId: user._id };

      if (status) filters.status = status;

      return await pagination({
        res: res,
        table: "Match requests",
        model: this.request,
        page: page,
        limit: limit,
        filters: filters,
        populate: requestSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
