const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
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
    }
  },
  { timestamps: true }
);

const Reel = model("Reel", schema);
module.exports = Reel;
