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

  async getCurrentFriendRequests(req, res) {
    try {
      const user = req.user;

      const { page, limit, status } = req.query;

      const filters = { userId: user._id, type: "friend", status: "pending" };

      if (status) filters.status = status;

      return await pagination({
        res: res,
        table: "Current requests",
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

  async getPendingFriendRequests(req, res) {
    try {
      const user = req.user;

      const { page, limit, status } = req.query;

      const filters = {
        receiverId: user._id,
        type: "friend",
        status: "pending"
      };

      if (status) filters.status = status;

      return await pagination({
        res: res,
        table: "Pending requests",
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

  async acceptFriendRequest(req, res) {
    try {
      const user = req.user;
      const { requestId } = req.body;

      const request = await this.request.findOne({
        _id: requestId,
        type: "friend",
        status: "pending"
      });

      if (!request)
        return handlers.response.failed({ res, message: "Invalid request ID" });

      request.status = "accepted";
      await request.save();

      // Create bi-directional friendship
      await Promise.all([
        this.friends.create({
          userId: request.senderId,
          friendId: request.receiverId
        }),
        this.friends.create({
          userId: request.receiverId,
          friendId: request.senderId
        })
      ]);

      const [sender, receiver] = await Promise.all([
        this.user.findById(request.senderId),
        this.user.findById(request.receiverId)
      ]);

      if (sender) {
        sender.totalFriends++;
        await sender.save();
      }

      if (receiver) {
        receiver.totalFriends++;
        await receiver.save();
      }

      user.totalAcceptedFriendRequests++;
      await user.save();

      return handlers.response.success({
        res,
        message: "Friend request accepted"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }

  async rejectFriendRequest(req, res) {
    try {
      const user = req.user;

      const { requestId } = req.body;

      const request = await this.request.findOne({
        _id: requestId,
        type: "friend",
        status: "pending"
      });

      if (!request) {
        return handlers.response.failed({
          res,
          message: "Invalid request ID"
        });
      }

      request.status = "rejected";
      await request.save();

      user.totalRejectedFriendRequests++;
      await user.save();

      return handlers.response.success({
        res,
        message: "Friend request rejected"
      });
    } catch (error) {
      return handlers.response.error({
        res,
        message: error.message
      });
    }
  }
}

module.exports = new Service();
