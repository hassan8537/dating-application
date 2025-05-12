const router = require("express").Router();
const controller = require("../../controllers/users/setting-controller");

// Notification Settings
router.patch("/notifications", controller.toggleNotifications.bind(controller));

// Anonymous Profile Settings
router.patch(
  "/anonymous-profile",
  controller.toggleAnonymousProfile.bind(controller)
);

// Privacy Settings
router.patch("/privacy", controller.togglePrivacy.bind(controller));

// Unsubscribe from service
router.delete("/subscription", controller.unsubscribe.bind(controller));

// Upgrade subscription
router.post(
  "/subscription/upgrade",
  controller.upgradeSubscription.bind(controller)
);

// Blocked Users
router.get("/users/blocked", controller.getBlockUsers.bind(controller));

// Block or Unblock a user
router.get(
  "/users/:userId/block",
  controller.toggleBlockUnblock.bind(controller)
);

// Hide or unhide yourself from a user
router.get(
  "/users/:userId/visibility",
  controller.toggleHiddenFromUsers.bind(controller)
);

module.exports = router;
