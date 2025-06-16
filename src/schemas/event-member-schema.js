const eventMemberSchema = {
  populate: [{ path: "eventId memberId" }]
};

module.exports = eventMemberSchema;
