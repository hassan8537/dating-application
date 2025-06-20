const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", default: null },
    receiverId: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "mention",
        "message",
        "match",
        "friend",
        "super-like",
        "custom",
        "invitation",
        "new-member"
      ],
      required: true
    },
    message: { type: String, trim: true, default: null },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

const Notification = model("Notification", schema);
module.exports = Notification;
