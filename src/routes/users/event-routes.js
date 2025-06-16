const router = require("express").Router();
const controller = require("../../controllers/users/event-controller");

router.get("/", controller.getEvents.bind(controller));

router.get("/joined", controller.getJoinedEvents.bind(controller));

router.post("/", controller.createEvent.bind(controller));

router.put("/:eventId", controller.updateEvent.bind(controller));

router.delete("/:eventId", controller.deleteEvent.bind(controller));

router.post("/:eventId/join", controller.joinEvent.bind(controller));

router.post(
  "/:eventId/invitations",
  controller.sendEventInvitation.bind(controller)
);

router.get(
  "/:eventId/invites",
  controller.getEventInvitedUsers.bind(controller)
);

module.exports = router;
