const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
      default: ""
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
      default: ""
    },
    text: {
      type: String,
      trim: true,
      default: ""
    },
    files: [
      {
        type: String,
        trim: true,
        default: ""
      }
    ],
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread"
    }
  },
  { timestamps: true }
);

const Chat = model("Chat", schema);
module.exports = Chat;
