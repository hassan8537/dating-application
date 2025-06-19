const LikedReel = require("../../models/LikedReel");
const SavedReel = require("../../models/SavedReel");

async function addLikeAndSaveFlags(reels, userId) {
  const reelIds = reels.map((r) => r._id);

  const [likedReels, savedReels] = await Promise.all([
    LikedReel.find({ userId, reelId: { $in: reelIds } }).lean(),
    SavedReel.find({ userId, reelId: { $in: reelIds } }).lean()
  ]);

  const likedSet = new Set(likedReels.map((r) => r.reelId.toString()));
  const savedSet = new Set(savedReels.map((r) => r.reelId.toString()));

  return reels.map((r) => ({
    ...r,
    isLiked: likedSet.has(r._id.toString()),
    isSaved: savedSet.has(r._id.toString())
  }));
}

async function addFlagsToSingleReel(reel, userId) {
  const [liked, saved] = await Promise.all([
    LikedReel.findOne({ userId, reelId: reel._id }).lean(),
    SavedReel.findOne({ userId, reelId: reel._id }).lean()
  ]);

  return {
    ...reel,
    isLiked: !!liked,
    isSaved: !!saved
  };
}

module.exports = { addLikeAndSaveFlags, addFlagsToSingleReel };
