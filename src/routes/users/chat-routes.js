const router = require("express").Router();

const controller = require("../../controllers/users/chat-controller");

router.get("/inbox", controller.getInbox.bind(controller));

module.exports = router;
