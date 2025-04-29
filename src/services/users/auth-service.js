const sendEmail = require("../../config/nodemailer");
const Otp = require("../../models/Otp");
const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const generateOtp = require("../../utilities/generators/otp-generator");
const generateToken = require("../../utilities/generators/token-generator");
const { handlers } = require("../../utilities/handlers/handlers");
const otpExpirationMinutes = process.env.OTP_EXPIRATION_MINUTES;

class Service {
  constructor() {
    this.user = User;
    this.otp = Otp;
  }

  async generateAndSendOtp(user, deviceToken, res) {
    const existingOtp = await this.otp.findOne({ userId: user._id });
    const now = new Date();
    if (existingOtp && existingOtp.expiresIn > now) {
      // Reuse existing valid OTP
      await sendEmail({
        to: user.email,
        subject: "Account Verification",
        text: `Your verification code is: ${existingOtp.code}`
      });
      const token = generateToken({ _id: user._id, res });
      user.sessionToken = token;
      user.deviceToken = deviceToken;
      user.isVerified = false;
      await user.save();
      await user.populate(userSchema.populate);
      return { user, token };
    }
    // Otherwise, generate a new OTP
    const otpCode = generateOtp();
    const expiresIn = new Date(Date.now() + otpExpirationMinutes * 60 * 1000);
    await this.otp.deleteOne({ userId: user._id });
    await this.otp.create({
      userId: user._id,
      code: otpCode,
      expiresIn,
      type: "email-verification"
    });
    const token = generateToken({ _id: user._id, res });
    user.sessionToken = token;
    user.deviceToken = deviceToken;
    user.isVerified = false;
    await user.save();
    await user.populate(userSchema.populate);
    await sendEmail({
      to: user.email,
      subject: "Account Verification",
      text: `Your verification code is: ${otpCode}`
    });
    return { user, token };
  }

  async signUpOrSignIn(req, res) {
    try {
      const { emailAddress, deviceToken } = req.body;

      let user = await this.user.findOne({ emailAddress });

      if (!user) {
        user = await this.user.create({
          emailAddress,
          deviceToken
        });
      }

      const { user: updatedUser } = await this.generateAndSendOtp(
        user,
        deviceToken,
        res
      );

      const message = updatedUser.isVerified
        ? "Signed in"
        : "User is not verified. A verification OTP has been sent to your email address";

      handlers.logger.success({ message, data: updatedUser });

      return handlers.response.success({
        res,
        message,
        data: updatedUser
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async socialSignUpOrSignIn(req, res) {
    try {
      const {
        firstName,
        lastName,
        emailAddress,
        provider,
        socialToken,
        phoneNumber,
        deviceToken
      } = req.body;

      if (emailAddress) {
        const emailAddressConflict = await this.user.findOne({ emailAddress });

        if (
          emailAddressConflict &&
          emailAddressConflict.provider !== provider
        ) {
          return handlers.response.success({
            res,
            message: "Email address already in use"
          });
        }
      }

      if (socialToken) {
        const socialTokenConflict = await this.user.findOne({ socialToken });
        if (socialTokenConflict && socialTokenConflict.provider !== provider) {
          return handlers.response.success({
            res,
            message: "Social token already in use"
          });
        } else {
        }
      }

      let user = await this.user.findOne({ socialToken, provider });

      if (!user) {
        // Create a new user if not found
        user = await this.user.create({
          firstName,
          lastName,
          emailAddress,
          provider,
          socialToken,
          phoneNumber,
          deviceToken
        });
      } else {
        // If user exists, update the social token and other details
        user.firstName = firstName;
        user.lastName = lastName;
        user.emailAddress = emailAddress;
        user.provider = provider;
        user.phoneNumber = phoneNumber;
        user.socialToken = socialToken;
        user.deviceToken = deviceToken;
        await user.save();
      }

      // Generate session token for the user
      const token = generateToken({ _id: user._id, res });

      user.sessionToken = token;

      // Save the updated user and populate the data
      await user.populate(userSchema.populate);

      handlers.logger.success({
        message: "Signed in!",
        data: user
      });

      return handlers.response.success({
        res,
        message: "Signed in!",
        data: user
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
