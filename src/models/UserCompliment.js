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
    compliment: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const UserCompliment = model("UserCompliment", schema);
module.exports = UserCompliment;
