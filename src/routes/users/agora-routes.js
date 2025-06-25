const router = require("express").Router();

const controller = require("../../controllers/users/agora-controller");

router.get("/accesstoken", controller.getAgoraAccessToken.bind(controller));

module.exports = router;
