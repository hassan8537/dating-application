const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const EventInvite = model("EventInvite", schema);
module.exports = EventInvite;
