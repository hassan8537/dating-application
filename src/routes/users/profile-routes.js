const router = require("express").Router();

const controller = require("../../controllers/users/profile-controller");

router.get("/myself", controller.getMyProfile.bind(controller));

router.post("/", controller.createProfile.bind(controller));

router.post("/create-avatar", controller.createAvatar.bind(controller));

router.post("/tell-us-about-yourself", controller.setGender.bind(controller));

router.post("/relationship", controller.setRelationship.bind(controller));

router.post("/feelings", controller.setFeelings.bind(controller));

router.post("/gallery", controller.uploadYourPhotosAndVideos.bind(controller));

router.post("/interests", controller.addYourInterests.bind(controller));

router.post("/hobbies", controller.addYourHobbies.bind(controller));

router.post("/professions", controller.addYourProfessions.bind(controller));

router.post(
  "/upload-certificates",
  controller.uploadCertificates.bind(controller)
);

router.post("/sos", controller.setSos.bind(controller));

router.put("/", controller.editProfile.bind(controller));

router.post("/", controller.deleteAccount.bind(controller));

router.put("/change-password", controller.changePassword.bind(controller));

module.exports = router;
