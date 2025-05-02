const sendEmail = require("../../config/nodemailer");
const Otp = require("../../models/Otp");
const User = require("../../models/User");
const userSchema = require("../../schemas/user-schema");
const generateOtp = require("../../utilities/generators/otp-generator");
const generateToken = require("../../utilities/generators/token-generator");
const { handlers } = require("../../utilities/handlers/handlers");

const otpExpirationMinutes = process.env.OTP_EXPIRATION_SECONDS;

class Service {
  constructor() {
    this.user = User;
    this.otp = Otp;
  }

  async verifyOtp(req, res) {
    try {
      const { userId, code, deviceToken } = req.body;

      const user = await this.user
        .findById(userId)
        .populate(userSchema.populate);

      if (user && user.isVerified) {
        handlers.logger.failed({ message: "Your account is already verified" });
        handlers.response.failed({
          res,
          message: "Your account is already verified"
        });

        return await this.otp.deleteMany({ userId: userId });
      }

      const otpRecord = await this.otp.findOne({ userId: userId, code });

      if (!otpRecord) {
        handlers.logger.failed({ message: "Invalid OTP" });
        return handlers.response.failed({ res, message: "Invalid OTP" });
      }

      if (otpRecord.isUsed) {
        handlers.logger.failed({ message: "OTP already used" });
        return handlers.response.failed({ res, message: "OTP already used" });
      }

      if (new Date() > otpRecord.expiresIn) {
        handlers.logger.failed({ message: "OTP expired" });
        return handlers.response.failed({ res, message: "OTP expired" });
      }

      await this.otp.deleteOne({ _id: otpRecord._id });

      await this.user.updateOne({ _id: userId }, { deviceToken });

      const token = generateToken({ _id: user._id, res });

      user.sessionToken = token;
      user.deviceToken = deviceToken;
      user.isVerified = true;
      await user.save();

      handlers.logger.success({
        message: "OTP verified successfully",
        data: user
      });
      return handlers.response.success({
        res,
        message: "OTP verified successfully",
        data: user
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: "Failed to verify OTP" });
    }
  }

  async resendOtp(req, res) {
    try {
      const { userId } = req.params;

      const user = await this.user.findById(userId);
      if (!user) {
        handlers.logger.failed({ message: "No user found" });
        return handlers.response.failed({ res, message: "No user found" });
      }

      const newOtpCode = generateOtp();
      const expiresIn = new Date(Date.now() + otpExpirationMinutes * 60 * 1000);

      await this.otp.updateMany({ userId }, { isUsed: true });

      await this.otp.create({
        userId,
        code: newOtpCode,
        expiresIn: expiresIn,
        type: "email-verification"
      });

      user.isVerified = false;
      await user.save();

      await sendEmail({
        to: user.emailAddress,
        subject: "Resend OTP",
        text: `Your new OTP is: ${newOtpCode}`
      });

      handlers.logger.success({ message: "OTP resent successfully" });
      return handlers.response.success({
        res,
        message: "OTP resent successfully"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: "Failed to resend OTP" });
    }
  }
}

module.exports = new Service();
