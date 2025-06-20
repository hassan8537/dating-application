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
      enum: ["friend", "meet-me-now", "match"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "matched"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Request = model("Request", schema);
module.exports = Request;
