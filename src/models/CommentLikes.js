const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    comment_id: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      trim: true
    }
  },
  { timestamps: true }
);

const CommentLikes = model("CommentLike", schema);
module.exports = CommentLikes;
