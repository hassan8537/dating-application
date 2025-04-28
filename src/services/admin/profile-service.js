const Chat = require("../../models/Chat");
const Comment = require("../../models/Comment");
const Event = require("../../models/Event");
const File = require("../../models/File");
const Otp = require("../../models/Otp");
const Reply = require("../../models/Reply");
const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const { comparePassword } = require("../../utilities/handlers/password");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.chat = Chat;
    this.comment = Comment;
    this.event = Event;
    this.file = File;
    this.otp = Otp;
    this.reply = Reply;
    this.user = User;
  }

  async getProfiles(req, res) {
    try {
      const { query } = req;
      const { page = 1, limit = 10, sort = "-createdAt", ...filters } = query;

      const queryFilters = {
        ...filters,
        role: { $ne: "admin" }
      };

      await pagination({
        res,
        table: "Users",
        model: this.user,
        filters: queryFilters,
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: userSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { body, user: current_user, params } = req;

      const target_id = params._id || current_user._id;
      const user = await this.user.findById(target_id);
      if (!user) {
        return handlers.response.unavailable({
          res,
          message: "No users found"
        });
      }

      const profile = await this.user
        .findByIdAndUpdate(user._id, body, { new: true, runValidators: true })
        .populate(userSchema.populate);

      if (!profile) {
        return handlers.response.unavailable({
          res,
          message: "Failed to update profile"
        });
      }

      handlers.logger.success({
        message: "Profile updated successfully",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Profile updated successfully",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { user: current_user, params } = req;

      const target_id = params._id || current_user._id;
      const user = await this.user.findById(target_id);
      if (!user) {
        handlers.logger.unavailable({ message: "No users found" });
        return handlers.response.unavailable({
          res,
          message: "No users found"
        });
      }

      await Promise.all([
        this.comment.deleteMany({ user_id: user._id }),
        this.event.deleteMany({ user_id: user._id }),
        this.file.deleteMany({ user_id: user._id }),
        this.otp.deleteMany({ user_id: user._id }),
        this.reply.deleteMany({ user_id: user._id }),
        this.chat.deleteMany({ user_id: user._id }),
        this.user.deleteOne({ _id: user._id })
      ]);

      handlers.logger.success({ message: "User and associated data deleted" });
      return handlers.response.success({
        res,
        message: "User and associated data deleted"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { user: current_user, body } = req;
      const { old_password, new_password } = body;

      const user = await this.user.findById(current_user._id);
      if (!user) {
        return handlers.response.unavailable({
          res,
          message: "No users found"
        });
      }

      const isOldMatch = await comparePassword({
        plainPassword: old_password,
        hashedPassword: user.password,
        res
      });

      if (!isOldMatch) {
        return handlers.response.failed({
          res,
          message: "Incorrect old password"
        });
      }

      const isSameAsOld = await comparePassword({
        plainPassword: new_password,
        hashedPassword: user.password,
        res
      });

      if (isSameAsOld) {
        return handlers.response.failed({
          res,
          message: "New password must differ from old password"
        });
      }

      user.password = new_password;
      await user.save();

      handlers.logger.success({ message: "Password changed successfully" });
      return handlers.response.success({
        res,
        message: "Password changed successfully"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
