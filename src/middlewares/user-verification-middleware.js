const { handlers } = require("../utilities/handlers/handlers");

const userVerification = (req, res, next) => {
  try {
    const user = req.user;

    if (!user.isVerified) {
      handlers.logger.failed({ message: "Verify your account" });
      return handlers.response.failed({ res, message: "Verify your account" });
    }

    handlers.logger.success({ message: "User verification successful" });
    return next();
  } catch (error) {
    handlers.logger.error({ message: error });
    return handlers.response.error({ message: "Failed to verify user" });
  }
};

module.exports = userVerification;
