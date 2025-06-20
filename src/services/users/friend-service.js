const Friends = require("../../models/Friend");
const FriendRequest = require("../../models/FriendRequest");
const User = require("../../models/User");
const friendRequestSchema = require("../../schemas/friend-request-schema");
const friendSchema = require("../../schemas/friend-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.friends = Friends;
    this.friendRequest = FriendRequest;
  }

  async getFriendRequests(req, res) {
    try {
      const user = req.user;

      const { page, limit, status } = req.query;

      const filters = { userId: user._id };

      if (status) filters.status = status;

      return await pagination({
        res: res,
        table: "Friend requests",
        model: this.friendRequest,
        page: page,
        limit: limit,
        filters: filters,
        populate: friendRequestSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getMyFriends(req, res) {
    try {
      const user = req.user;

      const filters = { userId: user._id };

      return await pagination({
        res: res,
        table: "My friends",
        model: this.friends,
        page: page,
        limit: limit,
        filters: filters,
        populate: friendSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
