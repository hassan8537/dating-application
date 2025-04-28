const notificationSchema = {
  populate: [
    { path: "user_id", populate: { path: "avatar" } },
    { path: "model_id" }
  ]
};

module.exports = notificationSchema;
