const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { handlers } = require("../utilities/handlers/handlers");

const secret_key = process.env.SECRET_KEY;

const sessionAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const incomingToken =
      (authorization && authorization.split(" ")[1]) ||
      req.cookies.authorization;

    if (!incomingToken) {
      return handlers.response.unauthorized({
        res,
        message: "No session token provided"
      });
    }

    const decoded = jwt.verify(incomingToken, secret_key);
    const user = await User.findById(decoded._id);

    if (!user || user.sessionToken !== incomingToken) {
      req.session.destroy((err) => {
        if (err) {
          handlers.logger.failed({
            error: "Failed to destroy session"
          });
          return handlers.response.failed({
            res,
            error: "Failed to destroy session"
          });
        }
        handlers.logger.unauthorized({
          message: "Invalid session token"
        });
        return handlers.response.unauthorized({
          res,
          message: "Invalid session token"
        });
      });
      return;
    }

    next();
  } catch (error) {
    handlers.logger.error({ message: error });

    req.session.destroy((err) => {
      if (err) {
        handlers.logger.failed({
          error: "Failed to destroy session"
        });
        return handlers.response.failed({
          res,
          error: "Failed to destroy session"
        });
      }
      handlers.logger.unauthorized({
        message: "Invalid or expired session token"
      });
      return handlers.response.unauthorized({
        res,
        message: "Invalid or expired session token"
      });
    });
  }
};

module.exports = sessionAuthorization;
