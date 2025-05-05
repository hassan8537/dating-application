const hiddenFromUsersSchema = {
  populate: [{ path: "user_id blocked_user" }]
};

module.exports = hiddenFromUsersSchema;
