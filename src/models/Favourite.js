const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    },
    favouriteUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true
    }
  },
  { timestamps: true }
);

const FavouriteUser = model("FavouriteUser", schema);
module.exports = FavouriteUser;
