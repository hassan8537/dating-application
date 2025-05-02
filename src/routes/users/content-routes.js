const router = require("express").Router();

const controller = require("../../controllers/users/content-controller");

router.get("/", controller.getContents.bind(controller));

router.get("/:content_id", controller.getContentById.bind(controller));

router.post("/", controller.createContent.bind(controller));

router.put("/:content_id", controller.updateContent.bind(controller));

router.delete("/:content_id", controller.deleteContent.bind(controller));

module.exports = router;
