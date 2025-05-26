const notificationSchema = {
  populate: [
    { path: "receiverId" },
    { path: "senderId" },
    { path: "metadata.postId" }
  ]
};

module.exports = notificationSchema;
