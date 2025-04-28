const router = require("express").Router();

const controller = require("../../controllers/users/like-controller");

// Manage
router.get(
  "/events/manage/:event_id",
  controller.manageEventLikes.bind(controller)
);

router.get(
  "/comments/manage/:comment_id",
  controller.manageCommentLikes.bind(controller)
);

router.get(
  "/replies/manage/:reply_id",
  controller.manageReplyLikes.bind(controller)
);

// Get
router.get("/events/:event_id", controller.getEventLikes.bind(controller));

router.get(
  "/comments/:comment_id",
  controller.getCommentLikes.bind(controller)
);

router.get("/replies/:reply_id", controller.getReplyLikes.bind(controller));

module.exports = router;
