const Friends = require("../../models/Friend");
const User = require("../../models/User");
const friendSchema = require("../../schemas/friend-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.friends = Friends;
  }

  async getMyFriends(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

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
