const User = require("../models/User");
const { handlers } = require("../utilities/handlers/handlers");

const accountStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const user = await User.findById(currentUser._id);

    if (!user) {
      return handlers.logger.error({ message: "We cannot find this user" });
    }

    handlers.logger.success({ message: "User status verification successful" });
    return next();
  } catch (error) {
    handlers.logger.error({ message: error });
    return handlers.response.error({
      res,
      message: "Failed to check account status"
    });
  }
};

module.exports = accountStatus;
