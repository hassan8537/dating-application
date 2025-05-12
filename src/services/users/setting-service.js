const BlockedUsers = require("../../models/BlockedUsers");
const HiddenFromUsers = require("../../models/HiddenFromUsers");
const User = require("../../models/User");
const blockedUserSchema = require("../../schemas/blocked-users-schema");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
    this.blockedUsers = BlockedUsers;
    this.hiddenFromUsers = HiddenFromUsers;
  }

  async toggleNotifications(req, res) {
    try {
      const currentUser = req.user;

      currentUser.isNotificationEnabled = !currentUser.isNotificationEnabled;
      await currentUser.save();
      await currentUser.populate(userSchema.populate);

      const message = `Notifications ${currentUser.isNotificationEnabled ? "enabled" : "disabled"}`;

      handlers.logger.success({ message, data: currentUser });

      return handlers.response.success({
        res,
        message,
        data: currentUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async toggleAnonymousProfile(req, res) {
    try {
      const currentUser = req.user;

      currentUser.isAnonymousProfile = !currentUser.isAnonymousProfile;
      await currentUser.save();
      await currentUser.populate(userSchema.populate);

      const message = `Anonymous profile ${currentUser.isAnonymousProfile ? "enabled" : "disabled"}`;

      handlers.logger.success({ message, data: currentUser });

      return handlers.response.success({
        res,
        message,
        data: currentUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async togglePrivacy(req, res) {
    try {
      const currentUser = req.user;

      currentUser.isPrivate = !currentUser.isPrivate;
      await currentUser.save();
      await currentUser.populate(userSchema.populate);

      const message = `Privacy ${currentUser.isPrivate ? "enabled" : "disabled"}`;

      handlers.logger.success({ message, data: currentUser });

      return handlers.response.success({
        res,
        message,
        data: currentUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { user: currentUser } = req;

      const updatedUser = await User.findByIdAndUpdate(
        currentUser._id,
        {
          isSubscribed: false,
          receiptToken: null
        },
        { new: true }
      );

      return handlers.response.success({
        res,
        message: "Successfully unsubscribed",
        data: updatedUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async upgradeSubscription(req, res) {
    try {
      const { user: currentUser } = req;
      const { receiptToken } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        currentUser._id,
        {
          isSubscribed: true,
          receiptToken: receiptToken
        },
        { new: true }
      );

      return handlers.response.success({
        res,
        message: "Subscription upgraded successfully",
        data: updatedUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async getBlockUsers(req, res) {
    try {
      const { user: currentUser } = req;
      const { page = 1, limit = 10 } = req.query;

      const filters = { user_id: currentUser._id };
      const sort = { createdAt: -1 };

      return pagination({
        res,
        table: "Blocked Users",
        model: this.blockedUsers,
        filters,
        page,
        limit,
        sort,
        populate: blockedUserSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async toggleBlockUnblock(req, res) {
    try {
      const { user: currentUser } = req;
      const { userId } = req.params;

      const isAlreadyBlocked = await BlockedUsers.findOne({
        user_id: currentUser._id,
        blocked_user: userId
      });

      let message;

      if (isAlreadyBlocked) {
        await BlockedUsers.deleteOne({ _id: isAlreadyBlocked._id });
        currentUser.totalBlockedUsers =
          (currentUser.totalBlockedUsers || 0) - 1;
        message = "User unblocked successfully.";
      } else {
        await BlockedUsers.create({
          user_id: currentUser._id,
          blocked_user: userId
        });
        currentUser.totalBlockedUsers =
          (currentUser.totalBlockedUsers || 0) + 1;
        message = "User blocked successfully.";
      }

      await currentUser.save();
      await currentUser.populate(userSchema.populate);

      return handlers.response.success({ res, message, data: currentUser });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async toggleHiddenFromUsers(req, res) {
    try {
      const { user: currentUser } = req;
      const { userId } = req.params;

      const existingEntry = await this.hiddenFromUsers.findOne({
        user_id: currentUser._id,
        hidden_from_user: userId
      });

      let message;

      if (existingEntry) {
        await this.hiddenFromUsers.deleteOne({ _id: existingEntry._id });
        currentUser.totalHiddenFromUsers =
          (currentUser.totalHiddenFromUsers || 0) - 1;
        message = "User removed from hidden list successfully.";
      } else {
        await this.hiddenFromUsers.create({
          user_id: currentUser._id,
          hidden_from_user: userId
        });
        currentUser.totalHiddenFromUsers =
          (currentUser.totalHiddenFromUsers || 0) + 1;
        message = "User added to hidden list successfully.";
      }

      await currentUser.save();
      await currentUser.populate(userSchema.populate);

      return handlers.response.success({ res, message, data: currentUser });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
