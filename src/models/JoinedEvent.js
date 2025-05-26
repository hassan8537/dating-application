const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true
    }
  },
  { timestamps: true }
);

const JoinedEvent = model("JoinedEvent", schema);
module.exports = JoinedEvent;
