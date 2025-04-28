const router = require("express").Router();

const controller = require("../../controllers/users/social-controller");

router.post("/manage", controller.toggleFollowUser.bind(controller));

router.get("/followers", controller.getFollowers.bind(controller));

router.get("/following", controller.getFollowing.bind(controller));

router.get("/friends", controller.getFriends.bind(controller));

module.exports = router;
