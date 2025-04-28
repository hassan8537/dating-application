const eventSchema = {
  populate: [{ path: "user_id", populate: "avatar" }, { path: "photo" }]
};

module.exports = eventSchema;
