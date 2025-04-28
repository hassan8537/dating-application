const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      default: null
    },
    rated_to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      trim: true,
      default: null
    }
  },
  { timestamps: true }
);

const UserRatings = model("UserRating", schema);
module.exports = UserRatings;
