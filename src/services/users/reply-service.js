const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Reply = require("../../models/Reply");
const replySchema = require("../../schemas/reply-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const ReplyLikes = require("../../models/ReplyLikes");

class ReplyService {
  constructor() {
    this.user = User;
    this.comment = Comment;
    this.reply = Reply;
    this.replyLikes = ReplyLikes;
  }

  async getReplies(req, res) {
    try {
      const { user: current_user, query } = req;

      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.user_id) filters.user_id = query.user_id;
      if (query.event_id) filters.event_id = query.event_id;
      if (query.comment_id) filters.comment_id = query.comment_id;

      const pageNumber = parseInt(query.page) || 1;
      const pageSize = parseInt(query.limit) || 10;
      const sort = query.sort || "-createdAt";

      const totalCount = await this.reply.countDocuments(filters);

      const replies = await this.reply
        .find(filters)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sort)
        .populate(replySchema.populate);

      if (!replies.length) {
        handlers.logger.unavailable({ message: "No replies found" });
        return handlers.response.unavailable({
          res,
          message: "No replies found"
        });
      }

      // Fetch liked reply_ids by current user
      const replyIds = replies.map((reply) => reply._id);

      const likedReplyIds = await this.replyLikes
        .find({
          reply_id: { $in: replyIds },
          user_id: current_user._id
        })
        .distinct("reply_id");

      const likedSet = new Set(likedReplyIds.map((id) => id.toString()));

      const enrichedReplies = replies.map((reply) => {
        const obj = reply.toObject();
        obj.is_liked = likedSet.has(reply._id.toString());
        return obj;
      });

      const responseData = {
        results: enrichedReplies,
        total_records: totalCount,
        total_pages: Math.ceil(totalCount / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({ message: "All replies", data: responseData });
      return handlers.response.success({
        res,
        object_type: "replies",
        message: "All replies",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error.message });
      return handlers.response.error({
        res,
        message: "Failed to load replies"
      });
    }
  }

  async createReply(req, res) {
    try {
      const { user, body } = req;
      const { event_id, comment_id, reply, emoji, files } = body;

      const newReply = new this.reply({
        user_id: user._id,
        event_id,
        comment_id,
        reply,
        emoji,
        files
      });

      await newReply.save();
      await newReply.populate(replySchema.populate);

      // Increment the total_replies count in the Comment model
      await this.comment.findByIdAndUpdate(comment_id, {
        $inc: { total_replies: 1 }
      });

      handlers.logger.success({ message: "Reply posted" });
      return handlers.response.success({
        res,
        message: "Reply posted"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: "Failed to post reply" });
    }
  }

  async updateReply(req, res) {
    try {
      const { user, params, body } = req;
      const { reply_id } = params;
      const { reply, emoji, files } = body;

      const existingReply = await this.reply.findOne({
        _id: reply_id,
        user_id: user._id
      });

      if (!existingReply) {
        handlers.logger.unavailable({
          message: "No reply found"
        });
        return handlers.response.unavailable({
          res,
          message: "No reply found"
        });
      }

      const updatedReply = await this.reply
        .findByIdAndUpdate(existingReply._id, { reply, emoji }, { new: true })
        .populate(replySchema.populate);

      handlers.logger.success({ message: "Reply updated" });
      return handlers.response.success({
        res,
        message: "Reply updated"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async deleteReply(req, res) {
    try {
      const { user, params } = req;
      const { reply_id } = params;

      const existingReply = await this.reply.findOne({
        _id: reply_id,
        user_id: user._id
      });

      if (!existingReply) {
        handlers.logger.unavailable({
          message: "No reply found"
        });
        return handlers.response.unavailable({
          res,
          message: "No reply found"
        });
      }

      const deletedReply = await this.reply
        .findByIdAndDelete(existingReply._id)
        .populate(replySchema.populate);

      // Decrement the total_replies count in the Comment model
      await this.comment.findByIdAndUpdate(existingReply.comment_id, {
        $inc: { total_replies: -1 }
      });

      handlers.logger.success({ message: "Reply deleted" });
      return handlers.response.success({
        res,
        message: "Reply deleted"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: "Failed to delete reply"
      });
    }
  }
}

module.exports = new ReplyService();
