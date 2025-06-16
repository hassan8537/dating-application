const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const EventMember = model("EventMember", schema);
module.exports = EventMember;
