const router = require("express").Router();
const controller = require("../../controllers/users/event-controller");

router.get("/", controller.getEvents.bind(controller));

router.post("/", controller.createEvent.bind(controller));

router.put("/:event_id", controller.updateEvent.bind(controller));

router.delete("/:event_id", controller.deleteEvent.bind(controller));

router.post("/join", controller.joinEvent.bind(controller));

router.post("/invite", controller.inviteMember.bind(controller));

module.exports = router;
