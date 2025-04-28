const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      trim: true,
      default: ""
    },
    reported_by: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        default: ""
      }
    ]
  },
  { timestamps: true }
);

const Report = model("Report", schema);
module.exports = Report;
