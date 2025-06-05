const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      default: null
    }
  },
  { timestamps: true }
);

const LikedReel = model("LikedReel", schema);
module.exports = LikedReel;
