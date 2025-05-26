const router = require("express").Router();
const controller = require("../../controllers/users/event-controller");

router.get("/", controller.getEvents.bind(controller));

router.get("/joined", controller.getJoinedEvents.bind(controller));

router.post("/", controller.createEvent.bind(controller));

router.put("/:eventId", controller.updateEvent.bind(controller));

router.delete("/:eventId", controller.deleteEvent.bind(controller));

router.get("/join/:eventId", controller.joinEvent.bind(controller));

module.exports = router;
