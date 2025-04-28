const User = require("../../models/User");
const Comment = require("../../models/Comment");
const commentSchema = require("../../schemas/comment-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const Reply = require("../../models/Reply");
const CommentLikes = require("../../models/CommentLikes");
const Event = require("../../models/Event"); // Add Event model for updating total_comments

class Service {
  constructor() {
    this.user = User;
    this.comment = Comment;
    this.commentLikes = CommentLikes;
    this.reply = Reply;
    this.event = Event; // Initialize Event model
  }

  async getComments(req, res) {
    try {
      const { query, user } = req;
      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.user_id) filters.user_id = query.user_id;
      if (query.event_id) filters.event_id = query.event_id;

      const pageNumber = parseInt(query.page) || 1;
      const pageSize = parseInt(query.limit) || 10;
      const sort = query.sort || "-createdAt";

      const totalCount = await this.comment.countDocuments(filters);

      const comments = await this.comment
        .find(filters)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sort)
        .populate(commentSchema.populate);

      if (!comments.length) {
        handlers.logger.unavailable({
          object_type: "comment",
          message: "No comments found"
        });
        return handlers.response.unavailable({
          res,
          message: "No comments found"
        });
      }

      // Fetch liked comment_ids by current user
      const commentIds = comments.map((comment) => comment._id);

      const likedCommentIds = await this.commentLikes
        .find({
          comment_id: { $in: commentIds },
          user_id: user._id
        })
        .distinct("comment_id");

      const likedSet = new Set(likedCommentIds.map((id) => id.toString()));

      const enrichedComments = comments.map((comment) => {
        const obj = comment.toObject();
        obj.is_liked = likedSet.has(comment._id.toString());
        return obj;
      });

      const responseData = {
        results: enrichedComments,
        total_records: totalCount,
        total_pages: Math.ceil(totalCount / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({
        object_type: "comment",
        message: "All comments",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "All comments",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ object_type: "comment", message: error.message });
      return handlers.response.error({
        res,
        message: "Failed to load comments"
      });
    }
  }

  async createComment(req, res) {
    try {
      const { user: current_user, body } = req;
      const { event_id, comment, emoji, files } = body;

      // Create the new comment
      const newComment = await this.comment.create({
        user_id: current_user._id,
        event_id,
        comment,
        emoji,
        files
      });

      // Increase total_comments in the related event
      await this.event.findByIdAndUpdate(event_id, {
        $inc: { total_comments: 1 }
      });

      await newComment.populate(commentSchema.populate);

      handlers.logger.success({ message: "Comment posted" });
      return handlers.response.success({
        res,
        message: "Comment posted"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: "Failed to post comment"
      });
    }
  }

  async updateComment(req, res) {
    try {
      const { user: current_user, params, body } = req;
      const { comment_id } = params;
      const { comment, emoji } = body;

      const existingComment = await this.comment
        .findOneAndUpdate(
          { _id: comment_id, user_id: current_user._id },
          { comment, emoji },
          { new: true }
        )
        .populate(commentSchema.populate);

      if (!existingComment) {
        handlers.logger.failed({
          message: "No comment found"
        });
        return handlers.response.failed({
          res,
          message: "No comment found"
        });
      }

      handlers.logger.success({
        message: "Comment updated"
      });
      return handlers.response.success({
        res,
        message: "Comment updated"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: "Failed to edit comment"
      });
    }
  }

  async deleteComment(req, res) {
    try {
      const { user: current_user, params } = req;
      const { comment_id } = params;

      // Find and delete the comment
      const deletedComment = await this.comment
        .findOneAndDelete({
          _id: comment_id,
          user_id: current_user._id
        })
        .populate(commentSchema.populate);

      if (!deletedComment) {
        handlers.logger.failed({
          message: "No comment found"
        });
        return handlers.response.failed({
          res,
          message: "No comment found"
        });
      }

      // Decrease total_comments in the related event
      await this.event.findByIdAndUpdate(deletedComment.event_id, {
        $inc: { total_comments: -1 }
      });

      handlers.logger.success({
        message: "Comment deleted",
        data: deletedComment
      });
      return handlers.response.success({
        res,
        message: "Comment deleted",
        data: deletedComment
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: "Failed to delete comment"
      });
    }
  }
}

module.exports = new Service();
