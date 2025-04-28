const router = require("express").Router();

const controller = require("../../controllers/users/otp-controller");

router.post("/verify", controller.verifyOtp.bind(controller));

router.get("/resend/:userId", controller.resendOtp.bind(controller));

module.exports = router;
