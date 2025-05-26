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
    status: {
      type: String,
      enum: ["pending", "accept", "reject"]
    }
  },
  { timestamps: true }
);

const FriendRequest = model("FriendRequest", schema);
module.exports = FriendRequest;
