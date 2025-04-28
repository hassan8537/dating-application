const fileSchema = {
  populate: [{ path: "user_id", populate: { path: "avatar" } }]
};

module.exports = fileSchema;
