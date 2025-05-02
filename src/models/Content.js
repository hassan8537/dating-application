const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
  {
    type: {
      type: String,
      trim: true,
      default: ""
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v);
        },
        message: "Invalid URL"
      }
    },
    image: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Content = mongoose.model("Content", schema);

module.exports = Content;
