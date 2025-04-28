const router = require("express").Router();

const controller = require("../../controllers/users/toggle-controller");

router.get("/notifications", controller.toggleNotifications.bind(controller));

router.get("/privacy", controller.togglePrivacy.bind(controller));

module.exports = router;
