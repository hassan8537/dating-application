const friendRequestSchema = {
  populate: [{ path: "senderId receiverId" }]
};

module.exports = friendRequestSchema;
