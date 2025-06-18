exports.likedUserSchema = {
  populate: [{ path: "userId likedUser" }]
};

exports.visitedUserSchema = {
  populate: [{ path: "userId visitedUser" }]
};

exports.passedUserSchema = {
  populate: [{ path: "userId passedUser" }]
};

exports.favouriteUserSchema = {
  populate: [{ path: "userId favouriteUser" }]
};
