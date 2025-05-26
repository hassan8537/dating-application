const commentSchema = {
  populate: [{ path: "userId" }]
};

module.exports = commentSchema;
