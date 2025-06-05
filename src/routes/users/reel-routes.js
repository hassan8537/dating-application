const router = require("express").Router();
const controller = require("../../controllers/users/reel-controller");

// Create a new reel
router.post("/", controller.createReel.bind(controller));

// Get reels created by the logged-in user
router.get("/me", controller.getMyReels.bind(controller));

// Get saved reels
router.get("/saves", controller.getSavedReels.bind(controller));

// Get liked reels
router.get("/likes", controller.getLikedReels.bind(controller));

// Share a reel
router.get("/:reelId/shares", controller.shareReel.bind(controller));

// Like/unlike a reel
router.post("/:reelId/likes", controller.toggleLikeReel.bind(controller));

// Save/unsave a reel
router.post("/:reelId/saves", controller.toggleSaveReel.bind(controller));

// Post a comment on a reel
router.post("/:reelId/comments", controller.postAComment.bind(controller));

// Get comments on a reel
router.get("/:reelId/comments", controller.getComments.bind(controller));

// delete comment on a reel
router.delete(
  "/:reelId/comments/:commentId",
  controller.deleteAComment.bind(controller)
);

// Post a reply to a comment
router.post(
  "/:reelId/comments/:commentId/replies",
  controller.postAReply.bind(controller)
);

// Get replies to a comment
router.get(
  "/:reelId/comments/:commentId/replies",
  controller.getReplies.bind(controller)
);

// delete reply on a comment
router.delete(
  "/:reelId/comments/:commentId/replies/:replyId",
  controller.deleteAReply.bind(controller)
);

// Get a specific reel by ID
router.get("/:reelId", controller.getReelById.bind(controller));

// Update a reel
router.put("/:reelId", controller.updateReel.bind(controller));

// Delete a reel
router.delete("/:reelId", controller.deleteReel.bind(controller));

// Get all reels (should be last as it's the most generic)
router.get("/", controller.getReels.bind(controller));

module.exports = router;
