exports.eventLikeSchema = {
  populate: [
    { path: "user_id", populate: "avatar" },
    { path: "event_id", populate: "photo" }
  ]
};

exports.commentLikeSchema = {
  populate: [
    { path: "user_id", populate: "avatar" },
    { path: "event_id", populate: "photo" }
  ]
};

exports.replyLikeSchema = {
  populate: [
    { path: "user_id", populate: "avatar" },
    { path: "event_id", populate: "photo" }
  ]
};
