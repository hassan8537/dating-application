const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    photo: {
      type: Schema.Types.ObjectId,
      ref: "File",
      trim: true
    },
    blur_hash: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      enum: ["public", "private"],
      trim: true,
      default: "public"
    },
    fee: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      trim: true,
      default: ""
    },
    date: {
      type: Date,
      trim: true
    },
    start_time: {
      type: Date,
      trim: true
    },
    end_time: {
      type: Date,
      trim: true
    },
    duration: {
      type: Number,
      trim: true
    },
    location: {
      name: { type: String, default: "" },
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    link: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    are_comments_enabled: {
      type: Boolean,
      trim: true,
      default: true
    },
    is_reported: {
      type: Boolean,
      trim: true,
      default: false
    },
    total_likes: {
      type: Number,
      default: 0
    },
    total_comments: {
      type: Number,
      default: 0
    },
    total_shares: {
      type: Number,
      default: 0
    },
    total_invited: {
      type: Number,
      default: 0
    },
    total_going: {
      type: Number,
      default: 0
    },
    total_arrived: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Event = model("Event", schema);
module.exports = Event;
