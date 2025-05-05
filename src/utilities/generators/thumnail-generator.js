const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

exports.generateThumbnail = async (videoPath) => {
  try {
    const video = path.join(global.rootdir, videoPath);
    console.log("Full video path:", video);

    // Check if the video exists
    if (!fs.existsSync(video)) {
      throw new Error("Video file not found");
    }

    // Ensure the thumbnail folder exists
    const thumbnailFolder = "uploads/thumbnails";
    if (!fs.existsSync(thumbnailFolder)) {
      fs.mkdirSync(thumbnailFolder, { recursive: true });
    }

    const thumbnailFilename = `thumbnail-${uuidv4()}.png`; // Generate a unique filename

    await new Promise((resolve, reject) => {
      ffmpeg(video)
        .screenshots({
          timestamps: [1], // Capture a thumbnail at 1 second into the video
          filename: thumbnailFilename,
          folder: thumbnailFolder
        })
        .on("end", () => resolve(path.join(thumbnailFolder, thumbnailFilename)))
        .on("error", (err) => reject(err));
    });

    console.log("Thumbnail generated successfully.");
    return path.join(thumbnailFolder, thumbnailFilename);
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error generating thumbnail");
  }
};
