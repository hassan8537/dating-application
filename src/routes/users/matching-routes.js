const router = require("express").Router();

const controller = require("../../controllers/users/matching-controller");

router.get("/matches", controller.getMatchingProfiles.bind(controller));

router.get(
  "/swipe-right/:userId",
  controller.swipeRightProfile.bind(controller)
);

router.get("/super-like/:userId", controller.superLikeProfile.bind(controller));

router.get("/swipe-left/:userId", controller.swipeLeftProfile.bind(controller));

module.exports = router;
