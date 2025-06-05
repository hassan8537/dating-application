const express = require("express");
const app = express();

// 🔹 Import Routes
const authRoutes = require("./auth-routes");
const otpRoutes = require("./otp-routes");
const fileRoutes = require("./file-routes");
const profileRoutes = require("./profile-routes");
const eventRoutes = require("./event-routes");
const commentRoutes = require("./comment-routes");
const replyRoutes = require("./reply-routes");
const chatRoutes = require("./chat-routes");
const likeRoutes = require("./like-routes");
const socialRoutes = require("./social-routes");
const reportRoutes = require("./report-routes");
const blockRoutes = require("./block-routes");
const toggleRoutes = require("./toggle-routes");
const subscriptionRoutes = require("./subscription-routes");
const contentRoutes = require("./content-routes");
const storyRoutes = require("./story-routes");
const settingRoutes = require("./setting-routes");
const matchingRoutes = require("./matching-routes");
const complimentRoutes = require("./compliment-routes");
const reelRoutes = require("./reel-routes");

// 🔹 Import Middlewares
const userAuthentication = require("../../middlewares/user-authentication-middleware");
const sessionAuthorization = require("../../middlewares/session-verification-middleware");
const accountStatus = require("../../middlewares/account-status-middleware");
const userVerification = require("../../middlewares/user-verification-middleware");

// 🔹 Apply Global Middlewares
const middlewares = [
  userAuthentication,
  sessionAuthorization,
  accountStatus,
  userVerification
];

// 🔹 Register Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/otps", otpRoutes);
app.use("/api/v1/files", middlewares, fileRoutes);
app.use("/api/v1/profiles", middlewares, profileRoutes);
app.use("/api/v1/events", middlewares, eventRoutes);
app.use("/api/v1/comments", middlewares, commentRoutes);
app.use("/api/v1/replies", middlewares, replyRoutes);
app.use("/api/v1/chats", middlewares, chatRoutes);
app.use("/api/v1/likes", middlewares, likeRoutes);
app.use("/api/v1/social", middlewares, socialRoutes);
app.use("/api/v1/reports", middlewares, reportRoutes);
app.use("/api/v1/blocks", middlewares, blockRoutes);
app.use("/api/v1/toggles", middlewares, toggleRoutes);
app.use("/api/v1/subscription", middlewares, subscriptionRoutes);
app.use("/api/v1/stories", middlewares, storyRoutes);
app.use("/api/v1/settings", middlewares, settingRoutes);
app.use("/api/v1/profiles", middlewares, matchingRoutes);
app.use("/api/v1/compliments", middlewares, complimentRoutes);
app.use("/api/v1/reels", middlewares, reelRoutes);

app.use("/api/v1/contents", contentRoutes);

module.exports = app;
