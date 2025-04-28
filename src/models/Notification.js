const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      trim: true,
      default: ""
    },
    title: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      trim: true,
      default: ""
    },
    model_id: {
      type: Schema.Types.ObjectId,
      trim: true,
      default: ""
    },
    meta_data: {
      type: Schema.Types.Mixed,
      trim: true
    },
    is_read: {
      type: Boolean,
      trim: true,
      default: false
    }
  },
  { timestamps: true }
);

const Notification = model("Notification", schema);
module.exports = Notification;
