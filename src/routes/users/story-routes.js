const router = require("express").Router();

const controller = require("../../controllers/users/story-controller");

router.get("/", controller.getStories.bind(controller));

router.get("/:storyId", controller.getStoryById.bind(controller));

router.post("/", controller.createStory.bind(controller));

router.delete("/:storyId", controller.deleteStory.bind(controller));

module.exports = router;
