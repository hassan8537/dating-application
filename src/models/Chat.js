const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
      default: ""
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
      default: ""
    },
    text: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

const Chat = model("Chat", schema);
module.exports = Chat;
