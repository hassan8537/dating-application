const router = require("express").Router();

const controller = require("../../controllers/users/realtime-controller");

router.post("/statistics", controller.getRealTimeStatistics.bind(controller));

router.post("/arrived", controller.arrived.bind(controller));

router.post("/opt-out", controller.optOut.bind(controller));

module.exports = router;
