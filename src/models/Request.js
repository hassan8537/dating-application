const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    type: {
      type: String,
      enum: ["friend-request", "meet-me-now"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Request = model("Request", schema);
module.exports = Request;
