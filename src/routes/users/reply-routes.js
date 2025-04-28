const router = require("express").Router();

const controller = require("../../controllers/users/reply-controller");

router.get("/", controller.getReplies.bind(controller));

router.post("/", controller.createReply.bind(controller));

router.put("/:reply_id", controller.updateReply.bind(controller));

router.delete("/:reply_id", controller.deleteReply.bind(controller));

module.exports = router;
