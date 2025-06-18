const router = require("express").Router();

const controller = require("../../controllers/users/explore-controller");

router.get("/liked/me", controller.profilesLikedMe.bind(controller));

router.get("/visited/me", controller.profilesVisitedMe.bind(controller));

router.get("/favourites", controller.favouriteProfiles.bind(controller));

router.get("/passed", controller.profilesIPassed.bind(controller));

router.get("/liked", controller.profilesILiked.bind(controller));

module.exports = router;
