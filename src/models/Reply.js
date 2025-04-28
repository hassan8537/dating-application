const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true
    },
    comment_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      trim: true
    },
    reply: {
      type: String,
      trim: true,
      default: ""
    },
    emoji: {
      type: String,
      trim: true,
      default: ""
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        trim: true,
        ref: "File"
      }
    ],
    total_likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Reply = model("Reply", schema);
module.exports = Reply;
