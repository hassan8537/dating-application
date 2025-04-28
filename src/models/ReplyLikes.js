const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    reply_id: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
      trim: true
    }
  },
  { timestamps: true }
);

const ReplyLikes = model("ReplyLike", schema);
module.exports = ReplyLikes;
