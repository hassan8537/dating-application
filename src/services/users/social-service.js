const User = require("../../models/User");
const socialSchema = require("../../schemas/social-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
  }

  async toggleFollowUser(req, res) {
    try {
      const { user, body } = req;
      const currentUserId = user._id;
      const { target_user_id } = body;

      if (!target_user_id) {
        return handlers.response.failed({
          res,
          message: "Target user ID is required"
        });
      }

      if (currentUserId.toString() === target_user_id) {
        return handlers.response.failed({
          res,
          message: "You cannot follow/unfollow yourself"
        });
      }

      const [currentUser, targetUser] = await Promise.all([
        this.user.findById(currentUserId),
        this.user.findById(target_user_id)
      ]);

      if (!targetUser) {
        return handlers.response.failed({
          res,
          message: "Target user not found"
        });
      }

      // Check if user is already following the target
      if (currentUser.following.includes(target_user_id)) {
        // Unfollow the user
        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== target_user_id
        );
        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== currentUserId.toString()
        );
        await Promise.all([currentUser.save(), targetUser.save()]);

        return handlers.response.success({
          res,
          message: "User unfollowed successfully"
        });
      } else {
        // Follow the user
        currentUser.following.push(target_user_id);
        targetUser.followers.push(currentUserId);
        await Promise.all([currentUser.save(), targetUser.save()]);

        return handlers.response.success({
          res,
          message: "User followed successfully"
        });
      }
    } catch (error) {
      console.log(error);
      return handlers.response.error({ res, message: error });
    }
  }

  async getFollowers(req, res) {
    try {
      const userId = req.query.user_id || req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const user = await this.user.findById(userId).select("followers");

      if (!user) {
        return handlers.response.failed({
          res,
          message: "User not found"
        });
      }

      const total = user.followers.length;
      const followers = await this.user
        .find({ _id: { $in: user.followers } })
        .populate("followers", "name email") // Populate necessary fields
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const followersWithFollowStatus = followers.map((follower) => {
        // Add the is_following field to each follower
        follower.is_following = user.following.includes(
          follower._id.toString()
        );
        return follower;
      });

      return handlers.response.success({
        res,
        message: "Followers fetched successfully",
        data: {
          results: followersWithFollowStatus,
          total_records: total,
          total_pages: Math.ceil(total / limit),
          current_page: page,
          page_size: limit
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getFollowing(req, res) {
    try {
      const userId = req.query.user_id || req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const user = await this.user.findById(userId).select("following");

      if (!user) {
        return handlers.response.failed({
          res,
          message: "User not found"
        });
      }

      const total = user.following.length;
      const following = await this.user
        .find({ _id: { $in: user.following } })
        .populate("following", "name email") // Populate necessary fields
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const followingWithFollowStatus = following.map((followedUser) => {
        // Add the is_following field to each following
        followedUser.is_following = user.following.includes(
          followedUser._id.toString()
        );
        return followedUser;
      });

      return handlers.response.success({
        res,
        message: "Following list fetched successfully",
        data: {
          results: followingWithFollowStatus,
          total_records: total,
          total_pages: Math.ceil(total / limit),
          current_page: page,
          page_size: limit
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getFriends(req, res) {
    try {
      const userId = req.query.user_id || req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const user = await this.user
        .findById(userId)
        .select("followers following");

      if (!user) {
        return handlers.response.failed({
          res,
          message: "User not found"
        });
      }

      const allUserIds = [...user.followers, ...user.following].map((id) =>
        id.toString()
      );
      const uniqueUserIds = [...new Set(allUserIds)];

      const users = await this.user
        .find({ _id: { $in: uniqueUserIds } })
        .select("name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const results = users.map((u) => {
        u.is_following = user.following.map(String).includes(u._id.toString());
        return u;
      });

      return handlers.response.success({
        res,
        message: "Friends fetched successfully",
        data: {
          results,
          total_records: uniqueUserIds.length,
          total_pages: Math.ceil(uniqueUserIds.length / limit),
          current_page: page,
          page_size: limit
        }
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
