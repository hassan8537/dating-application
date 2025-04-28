const router = require("express").Router();

const controller = require("../../controllers/admin/profile-controller");

router.get("/", controller.getProfiles.bind(controller));

router.put("/", controller.updateProfile.bind(controller));
router.put("/:_id", controller.updateProfile.bind(controller));

router.delete("/", controller.deleteAccount.bind(controller));

router.put("/change-password", controller.changePassword.bind(controller));

module.exports = router;
