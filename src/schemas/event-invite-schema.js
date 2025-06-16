const eventInviteSchema = {
  populate: [{ path: "eventId senderId receiverId" }]
};

module.exports = eventInviteSchema;
