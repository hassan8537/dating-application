const router = require("express").Router();

const controller = require("../../controllers/users/comment-controller");

router.get("/", controller.getComments.bind(controller));

router.post("/", controller.createComment.bind(controller));

router.put("/:comment_id", controller.updateComment.bind(controller));

router.delete("/:comment_id", controller.deleteComment.bind(controller));

module.exports = router;
