const reportSchema = {
  populate: [
    {
      path: "event_id",
      populate: { path: "photo" }
    },
    {
      path: "reported_by",
      populate: { path: "avatar" }
    }
  ]
};

module.exports = reportSchema;
