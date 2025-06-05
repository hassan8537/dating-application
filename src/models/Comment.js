const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      trim: true
    },
    comment: {
      type: String,
      trim: true,
      default: ""
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalReplies: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Comment = model("Comment", schema);
module.exports = Comment;
