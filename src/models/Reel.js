const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    video: {
      type: String,
      default: null
    },
    hashtags: {
      type: Array,
      default: []
    },
    privacyControls: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    totalSaves: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Reel = model("Reel", schema);
module.exports = Reel;
