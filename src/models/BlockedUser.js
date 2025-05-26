const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    blockedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const BlockedUsers = model("BlockedUser", schema);
module.exports = BlockedUsers;
