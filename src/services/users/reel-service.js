const Comment = require("../../models/Comment");
const SavedReel = require("../../models/SavedReel");
const LikedReel = require("../../models/LikedReel");
const Reel = require("../../models/Reel");
const Reply = require("../../models/Reply");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");
const {
  addLikeAndSaveFlags,
  addFlagsToSingleReel
} = require("../../utilities/generators/add-like-save-reels");

class Service {
  constructor() {
    this.reel = Reel;
    this.savedReel = SavedReel;
    this.likedReel = LikedReel;
    this.comment = Comment;
    this.reply = Reply;
    this.reelSchema = {
      populate: [{ path: "userId" }]
    };
    this.savedReelSchema = {
      populate: [{ path: "userId reelId" }]
    };
    this.likedReelSchema = {
      populate: [{ path: "userId reelId" }]
    };
    this.commentSchema = {
      populate: [{ path: "userId reelId" }]
    };
    this.replySchema = {
      populate: [{ path: "userId reelId commentId" }]
    };
  }

  async createReel(req, res) {
    try {
      const currentUser = req.user;
      const { video, hashtags, privacyControls } = req.body;
      const newReel = await this.reel.create({
        userId: req.user._id,
        video,
        hashtags,
        privacyControls
      });
      await newReel.populate(this.reelSchema.populate);

      currentUser.totalReels += 1;
      await currentUser.save();

      return handlers.response.success({
        res,
        message: "Created",
        data: newReel
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getMyReels(req, res) {
    try {
      const { user, query } = req;
      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filters = { userId: user._id };
      if (query.privacyControls)
        filters.privacyControls = query.privacyControls;

      const totalCount = await this.reel.countDocuments(filters);

      let reels = await this.reel
        .find(filters)
        .sort(query.sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(this.reelSchema.populate)
        .lean();

      reels = await addLikeAndSaveFlags(reels, user._id);

      return handlers.response.success({
        res,
        message: "Reels retrieved successfully.",
        data: {
          results: reels,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          pageSize: limit
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getReels(req, res) {
    try {
      const { user, query } = req;
      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filters = {};
      if (query.privacyControls)
        filters.privacyControls = query.privacyControls;

      const totalCount = await this.reel.countDocuments(filters);

      let reels = await this.reel
        .find(filters)
        .sort(query.sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(this.reelSchema.populate)
        .lean();

      reels = await addLikeAndSaveFlags(reels, user._id);

      return handlers.response.success({
        res,
        message: "Reels retrieved successfully.",
        data: {
          results: reels,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          pageSize: limit
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getReelById(req, res) {
    try {
      const { user, query, params } = req;
      const { reelId } = params;
      const filters = {};
      if (query.privacyControls)
        filters.privacyControls = query.privacyControls;

      let reel = await this.reel
        .findById(reelId)
        .populate(this.reelSchema.populate)
        .lean();

      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      reel = await addFlagsToSingleReel(reel, user._id);

      return handlers.response.success({ res, message: "Success", data: reel });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async updateReel(req, res) {
    try {
      const { reelId } = req.params;
      const { hashtags, privacyControls } = req.body;

      const updatedReel = await this.reel
        .findByIdAndUpdate(reelId, { hashtags, privacyControls }, { new: true })
        .populate(this.reelSchema.populate);

      if (!updatedReel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      return handlers.response.success({
        res,
        message: "Updated",
        data: updatedReel
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async deleteReel(req, res) {
    try {
      const currentUser = req.user;
      const { reelId } = req.params;
      const deleted = await this.reel.findByIdAndDelete(reelId);
      if (!deleted)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      currentUser.totalReels -= 1;
      await currentUser.save();

      return handlers.response.success({ res, message: "Deleted" });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async toggleSaveReel(req, res) {
    try {
      const currentUser = req.user;
      const { reelId } = req.params;
      const { _id: userId } = req.user;

      const reel = await this.reel.findById(reelId);
      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const saved = await this.savedReel.findOne({ userId, reelId });
      if (!saved) {
        currentUser.totalSavedReels += 1;
        await currentUser.save();

        reel.totalSaves += 1;
        await reel.save();

        await this.savedReel.create({ userId, reelId });
        return handlers.response.success({ res, message: "Saved" });
      }

      currentUser.totalSavedReels -= 1;
      await currentUser.save();

      reel.totalSaves -= 1;
      await reel.save();

      await this.savedReel.findOneAndDelete({ userId, reelId });
      return handlers.response.success({ res, message: "Unsaved" });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getSavedReels(req, res) {
    try {
      const { query } = req;

      return await pagination({
        res,
        table: "Saved reels",
        model: this.savedReel,
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        populate: this.savedReelSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async toggleLikeReel(req, res) {
    try {
      const currentUser = req.user;
      const { reelId } = req.params;
      const { _id: userId } = req.user;

      const reel = await this.reel.findById(reelId);
      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const liked = await this.likedReel.findOne({ userId, reelId });
      if (!liked) {
        currentUser.totalLikedReels += 1;
        await currentUser.save();

        reel.totalLikes += 1;
        await reel.save();

        await this.likedReel.create({ userId, reelId });
        return handlers.response.success({ res, message: "Liked" });
      }

      currentUser.totalLikedReels -= 1;
      await currentUser.save();

      reel.totalLikes -= 1;
      await reel.save();

      await this.likedReel.findOneAndDelete({ userId, reelId });
      return handlers.response.success({ res, message: "Disliked" });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getLikedReels(req, res) {
    try {
      const { query } = req;

      return await pagination({
        res,
        table: "Liked reels",
        model: this.likedReel,
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        populate: this.likedReelSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async shareReel(req, res) {
    try {
      const { reelId } = req.params;

      const reel = await this.reel.findById(reelId);

      if (!reel) {
        return handlers.response.failed({ res, message: "Invalid reel ID" });
      }

      reel.totalShares += 1;
      await reel.save();

      return handlers.response.success({ res, message: "Shared" });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async postAComment(req, res) {
    try {
      const { user, params, body } = req;

      const { reelId } = params;
      const { comment } = body;

      const reel = await this.reel.findById(reelId);
      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const newComment = new this.comment({
        userId: user._id,
        reelId: reelId,
        comment: comment
      });

      reel.totalComments += 1;
      await reel.save();

      await newComment.save();
      await newComment.populate(this.commentSchema.populate);

      return handlers.response.success({
        res,
        message: "Posted",
        data: newComment
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getComments(req, res) {
    try {
      const { params } = req;

      const { reelId } = params;

      const reel = await this.reel.findById(reelId);
      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const comments = await this.comment
        .find({
          reelId: reelId
        })
        .populate(this.commentSchema.populate);

      if (!comments.length)
        return handlers.response.success({
          res,
          message: "No comments yet"
        });

      return handlers.response.success({
        res,
        message: "Success",
        data: comments
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async deleteAComment(req, res) {
    try {
      const { user, params } = req;
      const { reelId, commentId } = params;

      const existingReel = await this.reel.findById(reelId);
      if (!existingReel) {
        return handlers.response.success({
          res,
          message: "Invalid reel ID"
        });
      }

      const existingComment = await this.comment.findOne({
        _id: commentId,
        userId: user._id,
        reelId: existingReel._id
      });

      if (!existingComment) {
        return handlers.response.success({
          res,
          message: "Invalid comment ID"
        });
      }

      await this.comment.findByIdAndDelete(existingComment._id);

      existingReel.totalComments -= 1;
      await existingReel.save();

      return handlers.response.success({
        res,
        message: "Deleted"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }

  async postAReply(req, res) {
    try {
      const { user, params, body } = req;

      const { commentId, reelId } = params;
      const { reply } = body;

      const comment = await this.comment.findById(commentId);
      const reel = await this.reel.findById(reelId);

      if (!comment)
        return handlers.response.failed({ res, message: "Invalid comment ID" });

      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const newReply = new this.reply({
        userId: user._id,
        reelId: reel._id,
        commentId: comment._id,
        reply
      });

      comment.totalReplies += 1;
      await comment.save();

      await newReply.save();
      await newReply.populate(this.replySchema.populate);

      return handlers.response.success({
        res,
        message: "Posted",
        data: newReply
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getReplies(req, res) {
    try {
      const { params } = req;

      const { commentId, reelId } = params;

      const reel = await this.reel.findById(reelId);
      const comment = await this.comment.findById(commentId);

      if (!comment)
        return handlers.response.failed({ res, message: "Invalid comment ID" });

      if (!reel)
        return handlers.response.failed({ res, message: "Invalid reel ID" });

      const replies = await this.reply
        .find({
          reelId: reel._id,
          commentId: comment._id
        })
        .populate(this.replySchema.populate);

      return handlers.response.success({
        res,
        message: "Posted",
        data: replies
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async deleteAReply(req, res) {
    try {
      const { user, params } = req;
      const { reelId, commentId, replyId } = params;

      const existingReel = await this.reel.findById(reelId);

      if (!existingReel) {
        return handlers.response.success({
          res,
          message: "Invalid reel ID"
        });
      }

      const existingComment = await this.comment.findById(commentId);

      if (!existingComment) {
        return handlers.response.success({
          res,
          message: "Invalid comment ID"
        });
      }

      const existingReply = await this.reply.findOne({
        _id: replyId,
        userId: user._id,
        commentId: existingComment._id,
        reelId: existingReel._id
      });

      if (!existingReply) {
        return handlers.response.success({
          res,
          message: "Invalid reply ID"
        });
      }

      await this.reply.findByIdAndDelete(existingReply._id);

      existingComment.totalReplies -= 1;
      await existingComment.save();

      return handlers.response.success({
        res,
        message: "Deleted"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
