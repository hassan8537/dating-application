const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

exports.generateThumbnail = async (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    throw new Error("Invalid file path provided for thumbnail generation");
  }

  const thumbnailFilename = `${Date.now()}_thumb.png`;
  const thumbnailPath = path.join("uploads", "thumbnails", thumbnailFilename);

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on("end", () => resolve(thumbnailPath))
      .on("error", (err) => reject(err))
      .screenshots({
        count: 1,
        folder: path.join("uploads", "thumbnails"),
        filename: thumbnailFilename,
        size: "320x240"
      });
  });
};
