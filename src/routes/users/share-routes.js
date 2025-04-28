const router = require("express").Router();

const controller = require("../../controllers/users/share-controller");

// Manage
router.get(
  "/events/manage/:event_id",
  controller.manageEventShares.bind(controller)
);

router.get(
  "/events/manage/:comment_id",
  controller.getEventShares.bind(controller)
);

module.exports = router;
