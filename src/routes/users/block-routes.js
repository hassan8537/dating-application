const router = require("express").Router();

const controller = require("../../controllers/users/block-controlller");

router.get("/", controller.getBlockedUsers.bind(controller));

router.post(
  "/block-unblock",
  controller.toggleBlockUnblockUser.bind(controller)
);

module.exports = router;
