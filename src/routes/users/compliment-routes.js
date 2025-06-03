const router = require("express").Router();

const controller = require("../../controllers/users/compliment-controller");

router.get("/", controller.getCompliments.bind(controller));

router.get("/me", controller.getMyCompliments.bind(controller));

router.post("/", controller.createCompliment.bind(controller));

module.exports = router;
