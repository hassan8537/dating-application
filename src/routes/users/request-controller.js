const router = require("express").Router();

const controller = require("../../controllers/users/request-controller");

router.get("/friends", controller.getFriendRequests.bind(controller));

router.get("/matches", controller.getMatchRequests.bind(controller));

module.exports = router;
