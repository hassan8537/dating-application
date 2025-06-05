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
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      trim: true
    },
    reply: {
      type: String,
      trim: true,
      default: ""
    },
    totalLikes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Reply = model("Reply", schema);
module.exports = Reply;
