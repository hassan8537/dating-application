const joinedEventSchema = {
  populate: [{ path: "userId eventId" }]
};

module.exports = joinedEventSchema;
