const { Schema, model } = require("mongoose");

const OTP_EXPIRATION_SECONDS = process.env.OTP_EXPIRATION_SECONDS;

const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    code: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["email-verification", "reset-password"],
      required: true
    },
    expiresIn: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + OTP_EXPIRATION_SECONDS * 1000)
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Otp = model("Otp", schema);
module.exports = Otp;
