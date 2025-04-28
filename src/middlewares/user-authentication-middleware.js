const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { handlers } = require("../utilities/handlers/handlers");

const secretKey = process.env.SECRET_KEY;

const userAuthentication = async (req, res, next) => {
  try {
    const bearerToken =
      req.headers["authorization"] || req.cookies.authorization;

    if (!bearerToken) {
      return handlers.response.failed({
        res,
        message: "Invalid session."
      });
    }

    const token = bearerToken.startsWith("Bearer ")
      ? bearerToken.split(" ")[1]
      : bearerToken;

    const verifiedToken = jwt.verify(token, secretKey);

    const user = await User.findById(verifiedToken._id);

    if (!user) {
      handlers.logger.unauthorized({
        message: "Unauthorized request"
      });
      return handlers.response.unauthorized({
        res,
        message: "Unauthorized request"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    handlers.logger.error({ message: error });
    return handlers.response.error({
      res,
      message: "Failed to authenticate user"
    });
  }
};

module.exports = userAuthentication;
