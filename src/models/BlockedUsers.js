const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    blocked_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const BlockedUsers = model("BlockedUsers", schema);
module.exports = BlockedUsers;
