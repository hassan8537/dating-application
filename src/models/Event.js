const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ["public", "private"],
      trim: true,
      default: "public"
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
    time: {
      type: Date,
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
    details: {
      type: String,
      trim: true,
      default: ""
    },
    isReported: {
      type: Boolean,
      trim: true,
      default: false
    },
    totalInvites: {
      type: Number,
      default: 0
    },
    totalMembers: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Event = model("Event", schema);
module.exports = Event;
