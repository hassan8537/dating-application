const Content = require("../../models/Content");
const { handlers } = require("../../utilities/handlers/handlers");

class ContentService {
  constructor() {
    this.content = Content;
  }

  async createContent(req, res) {
    try {
      const { type } = req.body;

      const existing = await this.content.findOne({ type });
      if (existing) {
        return handlers.response.failed({
          res,
          message: `Content with type '${type}' already exists`
        });
      }

      const content = await this.content.create(req.body);

      handlers.response.success({
        res,
        message: "Content created successfully",
        data: content
      });
    } catch (error) {
      handlers.response.error({ res, error });
    }
  }

  async getContents(req, res) {
    try {
      const contents = await this.content.find();
      handlers.response.success({
        res,
        message: "Content fetched successfully",
        data: contents
      });
    } catch (error) {
      handlers.response.error({ res, error });
    }
  }

  async getContentById(req, res) {
    try {
      const content = await this.content.findById(req.params.content_id);

      if (!content)
        return handlers.response.failed({
          res,
          message: "Content not found"
        });
      handlers.response.success({
        res,
        message: "Content fetched successfully",
        data: content
      });
    } catch (error) {
      handlers.response.error({ res, error });
    }
  }

  async updateContent(req, res) {
    try {
      const content = await this.content.findByIdAndUpdate(
        req.params.content_id,
        req.body,
        { new: true }
      );
      if (!content)
        return handlers.response.failed({
          res,
          message: "Content not found"
        });
      handlers.response.success({
        res,
        message: "Content updated successfully",
        data: content
      });
    } catch (error) {
      handlers.response.error({ res, error });
    }
  }

  async deleteContent(req, res) {
    try {
      const content = await this.content.findByIdAndDelete(
        req.params.content_id
      );
      if (!content)
        return handlers.response.failed({
          res,
          message: "Content not found"
        });
      handlers.response.success({
        res,
        message: "Content deleted successfully",
        data: content
      });
    } catch (error) {
      handlers.response.error({ res, error });
    }
  }
}

module.exports = new ContentService();
