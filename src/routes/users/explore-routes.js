const router = require("express").Router();

const controller = require("../../controllers/users/explore-controller");

router.get("/profiles", controller.getProfiles.bind(controller));

module.exports = router;
