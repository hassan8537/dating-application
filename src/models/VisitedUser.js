const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    visitedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const VisitedUser = model("VisitedUser", schema);
module.exports = VisitedUser;
