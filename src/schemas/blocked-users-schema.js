const blockedUserSchema = {
  populate: [{ path: "user_id blocked_user" }]
};

module.exports = blockedUserSchema;
