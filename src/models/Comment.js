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
    comment: {
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
        ref: "File",
        trim: true
      }
    ],
    total_likes: {
      type: Number,
      default: 0
    },
    total_replies: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Comment = model("Comment", schema);
module.exports = Comment;
