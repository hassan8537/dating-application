const Story = require("../../models/Story");
const pagination = require("../../utilities/pagination/pagination");
const { handlers } = require("../../utilities/handlers/handlers");
const storySchema = require("../../schemas/story-schema");

class Service {
  constructor() {
    this.story = Story;
    this.object_type = "story";
  }

  async createStory(req, res) {
    try {
      const formData = {
        userId: req.user._id,
        media: req.body.media,
        visibility: req.body.visibility
      };

      const newStory = new this.story(formData);
      const savedStory = await (
        await newStory.save()
      ).populate(storySchema.populate);

      handlers.logger.success({
        object_type: this.object_type,
        message: "Story created successfully",
        data: savedStory
      });

      return handlers.response.success({
        res,
        message: "Story created successfully",
        data: savedStory
      });
    } catch (error) {
      handlers.logger.error({
        object_type: this.object_type,
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to create story"
      });
    }
  }

  async getStories(req, res) {
    try {
      const {
        userId,
        visibility,
        status,
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = req.query;

      const filters = {};
      if (userId) filters.userId = userId;
      if (visibility) filters.visibility = visibility;
      if (status) filters.status = status;

      return await pagination({
        res,
        table: "Story",
        model: this.story,
        filters,
        page,
        limit,
        sort,
        populate: storySchema.populate
      });
    } catch (error) {
      handlers.logger.error({
        object_type: this.object_type,
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to fetch stories"
      });
    }
  }

  async getStoryById(req, res) {
    try {
      const story = await this.story
        .findOne({ _id: req.params.storyId })
        .populate(storySchema.populate);

      if (!story) {
        return handlers.response.failed({
          res,
          message: "Story not found"
        });
      }

      return handlers.response.success({
        res,
        message: "Story fetched successfully",
        data: story
      });
    } catch (error) {
      handlers.logger.error({
        object_type: this.object_type,
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to fetch story"
      });
    }
  }

  async deleteStory(req, res) {
    try {
      const deleted = await this.story.findOneAndDelete({
        _id: req.params.storyId
      });

      if (!deleted) {
        return handlers.response.failed({
          res,
          message: "Story not found"
        });
      }

      return handlers.response.success({
        res,
        message: "Story deleted successfully"
      });
    } catch (error) {
      handlers.logger.error({
        object_type: this.object_type,
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to delete story"
      });
    }
  }
}

module.exports = new Service();
