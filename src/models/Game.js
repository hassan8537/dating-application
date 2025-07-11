const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true
    },
    player1: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true
    },
    player2: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true
    },
    matchDecision: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);
