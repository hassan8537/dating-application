const User = require("../models/User");
const { handlers } = require("../utilities/handlers/handlers");

const adminSeeder = async (req, res, next) => {
  try {
    if (await User.findOne({ role: "admin" })) {
      handlers.logger.failed({ message: "Admin user already exists" });
      return next();
    }

    const adminUser = new User({
      first_name: "Super",
      last_name: "Admin",
      email_address: "admin@spontnetwork.com",
      phone_number: "+(1)555-555-5555",
      password: "Spont@123",
      role: "admin",
      is_verified: true
    });

    await adminUser.save();

    handlers.logger.failed({ message: "Admin user created successfully" });
    return next();
  } catch (error) {
    handlers.logger.failed({ message: error });
    return handlers.response.failed({
      res,
      message: "Failed to seed admin"
    });
  }
};

module.exports = adminSeeder;
