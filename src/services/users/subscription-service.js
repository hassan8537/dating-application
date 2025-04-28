const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
  }

  async subscribeNow(req, res) {
    try {
      const { body, user: currentUser } = req;

      const requiredFields = ["isSubscribed", "receiptToken"];
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length) {
        const message = `Missing required fields: ${missingFields.join(", ")}`;
        handlers.logger.failed({ message });
        return handlers.response.failed({ res, message });
      }

      const profileData = {
        isSubscribed: body.isSubscribed,
        receiptToken: body.receiptToken
      };

      const profile = await this.user
        .findByIdAndUpdate(currentUser._id, profileData, { new: true })
        .populate(userSchema.populate);

      handlers.logger.success({
        message: "Success",
        data: profile
      });
      return handlers.response.success({
        res,
        message: "Success",
        data: profile
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
