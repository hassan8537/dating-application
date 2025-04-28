const router = require("express").Router();

const controller = require("../../controllers/users/subscription-controller");

router.post("/subscribe-now", controller.subscribeNow.bind(controller));

module.exports = router;
