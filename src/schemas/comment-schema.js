const commentSchema = {
  populate: [
    { path: "user_id", populate: { path: "avatar" } },
    { path: "event_id", populate: { path: "photo" } },
    { path: "files" }
  ]
};

module.exports = commentSchema;
