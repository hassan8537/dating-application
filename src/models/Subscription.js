const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema({
  type: {
    type: String,
    enum: ["monthly", "annual"],
    trim: true,
    default: null
  },
  cost: {
    type: Number,
    trim: true,
    default: null
  },
  description: {
    type: String,
    trim: true,
    default: null
  }
});

const Subscription = model("Subscription", subscriptionSchema);
module.exports = Subscription;
