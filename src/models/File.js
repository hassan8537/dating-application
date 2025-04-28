const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: ""
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    field: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      trim: true,
      default: ""
    },
    size: {
      type: Number,
      default: 0
    },
    path: {
      type: String,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

const File = model("File", schema);
module.exports = File;
