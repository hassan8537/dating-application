const router = require("express").Router();

const controller = require("../../controllers/users/auth-controller");

router.post("/signup-or-signin", controller.signUpOrSignIn.bind(controller));

router.post(
  "/social-signup-or-signin",
  controller.socialSignUpOrSignIn.bind(controller)
);

module.exports = router;
