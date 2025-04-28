const express = require("express");
const app = express();

// 🔹 Import Routes
const authRoutes = require("./auth-routes");
const profilesRoutes = require("./profile-routes");

// 🔹 Import Middlewares
const adminAuthentication = require("../../middlewares/admin-authentication-middleware");
const sessionAuthorization = require("../../middlewares/session-verification-middleware");
const accountStatus = require("../../middlewares/account-status-middleware");

// 🔹 Apply Global Middlewares
const middlewares = [adminAuthentication, sessionAuthorization, accountStatus];

// 🔹 Register Routes
app.use("/api/v1/admin/auth", authRoutes);
app.use("/api/v1/admin/auth", middlewares, profilesRoutes);

module.exports = app;
