const User = require("../../model/User");
const Notification = require("../../model/Notification");
const notificationSchema = require("../../schemas/notification-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.notification = Notification;
    this.user = User;
  }

  async getNotifications(req, res) {
    try {
      const filters = {};

      const { user_id, type, model_id } = req.query;

      user_id ? (filters.user_id = user_id) : filters;
      type ? (filters.type = type) : filters;
      model_id ? (filters.model_id = model_id) : filters;

      const { page, limit, sort } = req.query;

      await pagination({
        res,
        table: "Notifications",
        model: this.notification,
        filters,
        page,
        limit,
        sort,
        populate: notificationSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createNotification({ user_id, title, type, model_id, meta_data }) {
    try {
      const newNotification = new this.notification({
        user_id,
        title,
        type,
        model_id,
        meta_data
      });

      await newNotification.save();
      await newNotification.populate(notificationSchema.populate);

      return newNotification;
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { user_id } = req.params;
      const notifications = await this.notification
        .find({ user_id })
        .populate(notificationSchema.populate);

      if (!notifications) {
        handlers.logger.unavailable({ message: "No unread notifications" });
        return handlers.response.unavailable({
          res,
          message: "No unread notifications"
        });
      }

      notifications.map((n) => (n.is_read = true));

      await notifications.save();

      handlers.logger.success({
        message: "Notifications marked read successfully",
        data: notifications
      });
      return handlers.response.success({
        res,
        message: "Notifications marked read successfully",
        data: notifications
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
