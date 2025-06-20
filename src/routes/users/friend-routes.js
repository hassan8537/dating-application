const router = require("express").Router();

const controller = require("../../controllers/users/friend-controller");

router.get("/me", controller.getMyFriends.bind(controller));

module.exports = router;
