const userSchema = {
  populate: [{ path: "followers following blockedUsers reportedUsers" }]
};

module.exports = userSchema;
