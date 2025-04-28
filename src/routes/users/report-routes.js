const router = require("express").Router();

const controller = require("../../controllers/users/report-controller");

// Manage
router.get("/", controller.getReports.bind(controller));

router.post("/:event_id", controller.createReport.bind(controller));

router.delete("/:event_id", controller.deleteReport.bind(controller));

module.exports = router;
