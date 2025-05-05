const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    reported_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const ReportedUsers = model("ReportedUsers", schema);
module.exports = ReportedUsers;
