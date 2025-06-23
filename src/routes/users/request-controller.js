const router = require("express").Router();

const controller = require("../../controllers/users/request-controller");

router.get(
  "/friends/current",
  controller.getCurrentFriendRequests.bind(controller)
);

router.get(
  "/friends/pending",
  controller.getPendingFriendRequests.bind(controller)
);

router.post("/friends/accept", controller.acceptFriendRequest.bind(controller));

router.post("/friends/reject", controller.rejectFriendRequest.bind(controller));

module.exports = router;
