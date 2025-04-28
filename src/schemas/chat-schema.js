const chatSchema = {
  populate: [
    { path: "sender_id", populate: "avatar" },
    { path: "receiver_id", populate: "avatar" }
  ]
};

module.exports = chatSchema;
