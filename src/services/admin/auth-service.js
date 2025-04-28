const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const generateToken = require("../../utilities/generators/token-generator");
const { handlers } = require("../../utilities/handlers/handlers");
const { comparePassword } = require("../../utilities/handlers/password");

class Service {
  constructor() {
    this.user = User;
  }

  async signIn(req, res) {
    try {
      const { email_address, password } = req.body;

      const existingUser = await this.user.findOne({
        email_address,
        role: "admin"
      });

      if (!existingUser) {
        handlers.logger.failed({ message: "Invalid credentials" });
        return handlers.response.failed({
          res,
          message: "Invalid credentials"
        });
      }

      const isPasswordValid = await comparePassword({
        plainPassword: password,
        hashedPassword: existingUser.password,
        res
      });

      if (!isPasswordValid) {
        handlers.logger.failed({ message: "Invalid credentials" });
        return handlers.response.failed({
          res,
          message: "Invalid credentials"
        });
      }

      // Generate session token
      const token = generateToken({ _id: existingUser._id, res });

      existingUser.sessionToken = token;
      await existingUser.save();
      await existingUser.populate(userSchema.populate);

      handlers.logger.success({ message: "Signed in!", data: existingUser });
      return handlers.response.success({
        res,
        message: "Signed in!",
        data: existingUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
