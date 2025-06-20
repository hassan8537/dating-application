const Friend = require("../../models/Friend");
const Request = require("../../models/Request");
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
    this.request = Request;
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

      // Fetch all excluded user IDs
      const [likedUsers, passedUsers, friends] = await Promise.all([
        this.swipeRight.find({ userId: currentUser._id }, "likedUser"),
        this.swipeLeft.find({ userId: currentUser._id }, "passedUser"),
        this.friend.find({ userId: currentUser._id }, "friendId")
      ]);

      const likedUserIds = likedUsers.map((doc) => doc.likedUser.toString());
      const passedUserIds = passedUsers.map((doc) => doc.passedUser.toString());
      const friendUserIds = friends.map((doc) => doc.friendId.toString());

      const excludedUserIds = new Set([
        ...likedUserIds,
        ...passedUserIds,
        ...friendUserIds
      ]);

      // Always exclude self
      excludedUserIds.add(currentUser._id.toString());

      const users = await this.user.find({
        _id: { $nin: Array.from(excludedUserIds) },
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
      const user = req.user;
      const targetUserId = req.body.userId;

      const targetUser = await this.user.findById(targetUserId);
      if (!targetUser) {
        return handlers.response.failed({
          res,
          message: "User not found"
        });
      }

      const isPassedProfile = await this.swipeLeft.findOne({
        userId: user._id,
        passedUser: targetUser._id
      });

      if (isPassedProfile) {
        return handlers.response.failed({
          res,
          message: "You have already passed this profile"
        });
      }

      const isLikedProfile = await this.swipeRight.findOne({
        userId: user._id,
        likedUser: targetUser._id
      });

      if (isLikedProfile) {
        return handlers.response.failed({
          res,
          message: "You have already liked this profile"
        });
      }

      const isTargetUserLikedYou = await this.swipeRight.findOne({
        userId: targetUser._id,
        likedUser: user._id
      });

      // If the target user liked back, make them friends
      if (isTargetUserLikedYou) {
        await Promise.all([
          this.friend.create({
            userId: user._id,
            friendId: targetUser._id
          }),
          this.friend.create({
            userId: targetUser._id,
            friendId: user._id
          }),
          this.request.create({
            senderId: user._id,
            receiverId: targetUser._id,
            type: "match",
            status: "matched"
          }),
          this.swipeRight.create({
            userId: user._id,
            likedUser: targetUser._id
          })
        ]);

        user.totalProfilesILiked++;

        user.totalFriends++;
        targetUser.totalFriends++;

        await Promise.all([user.save(), targetUser.save()]);

        return handlers.response.success({
          res,
          message: "You are now friends!"
        });
      }

      // If not matched, just like the user
      const likedUser = await this.swipeRight.create({
        userId: user._id,
        likedUser: targetUser._id
      });

      this.request.create({
        senderId: user._id,
        receiverId: targetUser._id,
        type: "match",
        status: "pending"
      });

      user.totalProfilesILiked++;
      await user.save();

      return handlers.response.success({
        res,
        message: "Success",
        data: likedUser
      });
    } catch (error) {
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

      const existingFriendRequest = await this.request.findOne({
        senderId: currentUser._id,
        receiverId: userId,
        type: "friend",
        status: "pending"
      });

      if (existingFriendRequest) {
        return handlers.response.success({
          res,
          message: "You have already super liked this profile"
        });
      }

      await this.request.create({
        senderId: currentUser._id,
        receiverId: userId,
        type: "friend",
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
