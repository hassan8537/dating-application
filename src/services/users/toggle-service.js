const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
  }

  async toggleNotifications(req, res) {
    try {
      const current_user = req.user;

      current_user.is_notification_enabled =
        !current_user.is_notification_enabled;
      await current_user.save();
      await current_user.populate(userSchema.populate);

      const message = `Notifications ${current_user.is_notification_enabled ? "enabled" : "disabled"}`;

      handlers.logger.success({ message, data: current_user });

      return handlers.response.success({
        res,
        message,
        data: current_user
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async togglePrivacy(req, res) {
    try {
      const current_user = req.user;

      current_user.is_private = !current_user.is_private;
      await current_user.save();
      await current_user.populate(userSchema.populate);

      const message = `Privacy ${current_user.is_private ? "enabled" : "disabled"}`;

      handlers.logger.success({ message, data: current_user });

      return handlers.response.success({
        res,
        message,
        data: current_user
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
