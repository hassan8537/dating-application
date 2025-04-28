const socialSchema = {
  populate: [
    { path: "followers", populate: "avatar" },
    {
      path: "following",
      populate: "avatar"
    }
  ]
};

module.exports = socialSchema;
