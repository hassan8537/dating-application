const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true
    }
  },
  { timestamps: true }
);

const EventGoingMembers = model("EventGoingMember", schema);
module.exports = EventGoingMembers;
