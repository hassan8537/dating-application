const User = require("../../models/User");
const Comment = require("../../models/Comment");
const commentSchema = require("../../schemas/comment-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const Reply = require("../../models/Reply");
const CommentLikes = require("../../models/CommentLikes");
const ReplyLikes = require("../../models/ReplyLikes");
const Event = require("../../models/Event");
const EventLikes = require("../../models/EventLikes");
const eventSchema = require("../../schemas/event-schema");
const { eventLikeSchema } = require("../../schemas/like-schema");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
    this.eventLikes = EventLikes;
    this.comment = Comment;
    this.commentLikes = CommentLikes;
    this.reply = Reply;
    this.replyLikes = ReplyLikes;
  }

  async manageCommentLikes(req, res) {
    try {
      const { comment_id } = req.params;
      const user_id = req.user._id;

      const comment = await this.comment.findById(comment_id);
      if (!comment) {
        handlers.logger.failed({
          object_type: "comment",
          message: "No comment found"
        });
        return handlers.response.failed({ res, message: "No comment found" });
      }

      // Check if the user has already liked the comment
      const existingLike = await this.commentLikes.findOne({
        comment_id,
        user_id
      });

      let message = "Unliked";

      if (!existingLike) {
        // Add like
        await this.commentLikes.create({ comment_id, user_id });
        await this.comment.updateOne(
          { _id: comment_id },
          { $inc: { total_likes: 1 } }
        );
        message = "Liked";
      } else {
        // Remove like
        await this.commentLikes.deleteOne({ _id: existingLike._id });
        await this.comment.updateOne(
          { _id: comment_id },
          { $inc: { total_likes: -1 } }
        );
      }

      // Get updated total_likes count
      const updatedComment = await this.comment
        .findById(comment_id)
        .populate(commentSchema.populate);

      handlers.logger.success({
        object_type: "comment-likes",
        message
      });

      return handlers.response.success({ res, message });
    } catch (error) {
      handlers.logger.error({
        message: error
      });
      return handlers.response.error({
        res,
        message: "Failed to manage comment likes"
      });
    }
  }

  async getCommentLikes(req, res) {
    try {
      const { comment_id } = req.params;
      const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

      // Convert page and limit to numbers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Count total likes
      const totalLikes = await this.commentLikes.countDocuments({ comment_id });

      // Fetch likes with pagination and sorting
      const commentLikes = await this.commentLikes
        .find({ comment_id })
        .sort(sort)
        .skip(skip)
        .limit(pageSize);

      // Response data
      const responseData = {
        results: commentLikes,
        total_records: totalLikes,
        total_pages: Math.ceil(totalLikes / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({
        message: "Comment likes fetched successfully",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "Comment likes fetched successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error.message });

      return handlers.response.error({
        res,
        message: "Failed to fetch comment likes"
      });
    }
  }

  async manageReplyLikes(req, res) {
    try {
      const { reply_id } = req.params;
      const user_id = req.user._id;

      const reply = await this.reply.findById(reply_id);
      if (!reply) {
        handlers.logger.failed({
          object_type: "reply",
          message: "No reply found"
        });
        return handlers.response.failed({ res, message: "No reply found" });
      }

      // Check if the user has already liked the reply
      const existingLike = await this.replyLikes.findOne({ reply_id, user_id });

      let message = "Unliked";

      if (!existingLike) {
        // Add like
        await this.replyLikes.create({ reply_id, user_id });
        await this.reply.updateOne(
          { _id: reply_id },
          { $inc: { total_likes: 1 } }
        );
        message = "Liked";
      } else {
        // Remove like
        await this.replyLikes.deleteOne({ _id: existingLike._id });
        await this.reply.updateOne(
          { _id: reply_id },
          { $inc: { total_likes: -1 } }
        );
      }

      // Get updated total_likes count
      const updatedReply = await this.reply
        .findById(reply_id)
        .populate(replySchema.populate);

      handlers.logger.success({
        object_type: "reply-likes",
        message
      });

      return handlers.response.success({ res, message });
    } catch (error) {
      handlers.logger.error({
        object_type: "reply-likes",
        message: error
      });
      return handlers.response.error({
        res,
        message: "Failed to manage reply likes"
      });
    }
  }

  async getReplyLikes(req, res) {
    try {
      const { reply_id } = req.params;
      const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

      // Convert page and limit to numbers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Count total likes
      const totalLikes = await this.replyLikes.countDocuments({
        reply_id
      });

      // Fetch likes with pagination and sorting
      const replyLikes = await this.replyLikes
        .find({ reply_id })
        .sort(sort)
        .skip(skip)
        .limit(pageSize);

      // Response data
      const responseData = {
        results: replyLikes,
        total_records: totalLikes,
        total_pages: Math.ceil(totalLikes / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({
        message: "Reply likes fetched successfully",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "Reply likes fetched successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });

      return handlers.response.error({
        res,
        message: "Failed to fetch reply likes"
      });
    }
  }

  async manageEventLikes(req, res) {
    try {
      const { event_id } = req.params;
      const user_id = req.user._id;

      const event = await this.event.findById(event_id);
      if (!event) {
        handlers.logger.failed({
          message: "No event found"
        });
        return handlers.response.failed({ res, message: "No event found" });
      }

      // Check if the user has already liked the event
      const existingLike = await this.eventLikes.findOne({
        event_id: event_id,
        user_id
      });

      let message = "Unliked";

      if (!existingLike) {
        // Add like
        await this.eventLikes.create({ event_id: event_id, user_id });
        await this.event.updateOne(
          { _id: event_id },
          { $inc: { total_likes: 1 } }
        );
        message = "Liked";
      } else {
        // Remove like
        await this.eventLikes.deleteOne({ _id: existingLike._id });
        await this.event.updateOne(
          { _id: event_id },
          { $inc: { total_likes: -1 } }
        );
      }

      // Get updated total_likes count
      const updatedEvent = await this.event
        .findById(event_id)
        .populate(eventSchema.populate);

      handlers.logger.success({
        message
      });

      return handlers.response.success({ res, message });
    } catch (error) {
      handlers.logger.error({
        message: error
      });
      return handlers.response.error({
        res,
        message: "Failed to manage event likes"
      });
    }
  }

  async getEventLikes(req, res) {
    try {
      const { event_id } = req.params;
      const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

      // Convert page and limit to numbers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Count total likes
      const totalLikes = await this.eventLikes.countDocuments({
        event_id
      });

      // Fetch likes with pagination and sorting
      const replyLikes = await this.eventLikes
        .find({ event_id })
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .populate(eventLikeSchema.populate);

      // Response data
      const responseData = {
        results: replyLikes,
        total_records: totalLikes,
        total_pages: Math.ceil(totalLikes / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({
        message: "Event likes fetched successfully",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "Event likes fetched successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });

      return handlers.response.error({
        res,
        message: "Failed to fetch event likes"
      });
    }
  }
}

module.exports = new Service();
