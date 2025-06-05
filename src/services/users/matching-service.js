const Friend = require("../../models/Friend");
const FriendRequest = require("../../models/FriendRequest");
const Notification = require("../../models/Notification");
const SwipeLeft = require("../../models/SwipeLeft");
const SwipeRight = require("../../models/SwipeRight");
const User = require("../../models/User");
const {
  calculateMatchScore
} = require("../../utilities/algorithm/matching-algorithm");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
    this.swipeRight = SwipeRight;
    this.swipeLeft = SwipeLeft;
    this.friend = Friend;
    this.friendRequest = FriendRequest;
    this.notification = Notification;
  }

  async getMatchingProfiles(req, res) {
    try {
      const currentUser = await this.user.findById(req.user._id);
      if (!currentUser) {
        handlers.logger.unavailable({ message: "User not found" });
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;

      const users = await this.user.find({
        _id: { $ne: currentUser._id },
        isActive: true,
        isProfileCompleted: true
      });

      const matches = users.map((target) => {
        const score = calculateMatchScore(currentUser, target);
        return {
          user: target,
          matchScore: parseFloat(score.toFixed(2))
        };
      });

      matches.sort((a, b) => b.matchScore - a.matchScore);

      const paginatedMatches = matches.slice(skip, skip + pageSize);

      const responseData = {
        results: paginatedMatches.map((m) => ({
          ...m,
          matchScore: `${m.matchScore}%`
        })),
        totalRecords: matches.length,
        totalPages: Math.ceil(matches.length / pageSize),
        currentPage: pageNumber,
        pageSize: pageSize
      };

      handlers.logger.success({
        message: "Matching profiles fetched",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "Matching profiles fetched",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async swipeRightProfile(req, res) {
    try {
      const { userId } = req.params;

      const [currentUser, targetUser] = await Promise.all([
        this.user.findById(req.user._id),
        this.user.findById(userId)
      ]);

      if (!currentUser || !targetUser) {
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      if (targetUser.isSwipeLeft === true) {
        return handlers.response.failed({
          res,
          message: "You cannot like this profile"
        });
      }

      const isAnonymousProfile = currentUser.isAnonymousProfile;

      const existingSwipeRight = await this.swipeRight.findOne({
        userId: currentUser._id,
        likedUser: userId
      });

      if (existingSwipeRight) {
        return handlers.response.success({
          res,
          message: "You already have liked this profile"
        });
      }

      await this.swipeRight.create({
        userId: currentUser._id,
        likedUser: userId
      });

      currentUser.totalProfilesILiked++;
      await currentUser.save();

      const message = isAnonymousProfile
        ? "Someone has liked your profile"
        : `${currentUser.firstName} ${currentUser.lastName} has liked your profile`;

      await this.notification.create({
        senderId: currentUser._id,
        receiverId: userId,
        type: "like",
        message: message
      });

      return handlers.response.success({
        res,
        message: "Liked"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async superLikeProfile(req, res) {
    try {
      const { userId } = req.params;

      const [currentUser, targetUser] = await Promise.all([
        this.user.findById(req.user._id),
        this.user.findById(userId)
      ]);

      if (!currentUser || !targetUser) {
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      // Check if already swiped left
      const existingSwipeLeft = await this.swipeLeft.findOne({
        userId: currentUser._id,
        passedUser: userId
      });

      if (existingSwipeLeft) {
        return handlers.response.success({
          res,
          message: "You have already passed this profile"
        });
      }

      // Check if already swiped right
      const existingSwipeRight = await this.swipeRight.findOne({
        userId: currentUser._id,
        likedUser: userId
      });

      if (existingSwipeRight) {
        return handlers.response.success({
          res,
          message: "You have already liked this profile"
        });
      }

      const existingFriendRequest = await this.friendRequest.findOne({
        senderId: currentUser._id,
        receiverId: userId,
        status: "pending"
      });

      if (existingFriendRequest) {
        return handlers.response.success({
          res,
          message: "You have already super liked this profile"
        });
      }

      await this.friendRequest.create({
        senderId: currentUser._id,
        receiverId: userId,
        status: "pending"
      });

      const message = currentUser.isAnonymousProfile
        ? "Someone has super liked your profile"
        : `${currentUser.firstName} ${currentUser.lastName} has super liked your profile`;

      await this.notification.create({
        senderId: currentUser._id,
        receiverId: userId,
        type: "super-like",
        message: message
      });

      currentUser.totalPendingFriendRequests++;
      await currentUser.save();

      return handlers.response.success({
        res,
        message: "Super Liked"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async swipeLeftProfile(req, res) {
    try {
      const { userId } = req.params;

      const [currentUser, targetUser] = await Promise.all([
        this.user.findById(req.user._id),
        this.user.findById(userId)
      ]);

      if (!currentUser || !targetUser) {
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      const existingSwipeLeft = await this.swipeLeft.findOne({
        userId: currentUser._id,
        passedUser: userId
      });

      if (existingSwipeLeft) {
        return handlers.response.success({
          res,
          message: "You already have passed this profile"
        });
      }

      await this.swipeLeft.create({
        userId: currentUser._id,
        passedUser: userId
      });

      currentUser.totalProfilesIPassed++;
      await currentUser.save();

      // Mark the target user as swiped left (unlikeable)
      targetUser.isSwipeLeft = true;
      await targetUser.save();

      return handlers.response.success({
        res,
        message: "Passed"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
