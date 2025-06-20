const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    location: {
      name: { type: String, default: null },
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0], index: "2dsphere" }
    }
  },
  { timestamps: true }
);

const SafeHouse = model("SafeHouse", schema);
module.exports = SafeHouse;
