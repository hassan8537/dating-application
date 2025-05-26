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

      const { receiverId, type, "metadata.postId": postId } = req.query;

      if (receiverId) filters.receiverId = receiverId;
      if (type) filters.type = type;
      if (postId) filters["metadata.postId"] = postId;

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

  async createNotification({
    senderId = null,
    receiverId,
    type,
    message = null,
    metadata = {}
  }) {
    try {
      const newNotification = new this.notification({
        senderId,
        receiverId,
        type,
        message,
        metadata
      });

      await newNotification.save();
      await newNotification.populate(notificationSchema.populate);

      return newNotification;
    } catch (error) {
      handlers.logger.error({ message: error });
      return null;
    }
  }

  async markAsRead(req, res) {
    try {
      const { userId } = req.params;

      const notifications = await this.notification.find({
        receiverId: userId,
        isRead: false
      });

      if (!notifications.length) {
        handlers.logger.unavailable({ message: "No unread notifications" });
        return handlers.response.unavailable({
          res,
          message: "No unread notifications"
        });
      }

      await Promise.all(
        notifications.map((n) => {
          n.isRead = true;
          return n.save();
        })
      );

      handlers.logger.success({
        message: "Notifications marked as read",
        data: notifications
      });

      return handlers.response.success({
        res,
        message: "Notifications marked as read",
        data: notifications
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
