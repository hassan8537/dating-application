const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    media: [
      {
        type: {
          type: String,
          enum: ["photo", "video"],
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public"
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Story", schema);
