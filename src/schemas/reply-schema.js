const replySchema = {
  populate: [
    { path: "user_id", populate: { path: "avatar" } },
    { path: "event_id", populate: { path: "photo" } },
    {
      path: "comment_id",
      populate: [
        { path: "user_id", populate: { path: "avatar" } },
        { path: "event_id", populate: { path: "photo" } },
        { path: "files" }
      ]
    },
    { path: "files" }
  ]
};

module.exports = replySchema;
