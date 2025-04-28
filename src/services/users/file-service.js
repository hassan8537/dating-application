const File = require("../../models/File");
const { handlers } = require("../../utilities/handlers/handlers");
const path = require("path");
const fs = require("fs");
const fileSchema = require("../../schemas/file-schema");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.file = File;
  }

  async getFiles(req, res) {
    try {
      const { user: current_user, params, query } = req;

      const filters = {};

      if (current_user.role === "admin" && params._id) {
        filters._id = params._id;
      } else if (current_user.role !== "admin") {
        filters.user_id = current_user._id;
      }

      if (query._id) filters._id = query._id;
      if (query.user_id) filters.user_id = query.user_id;
      if (query.type) filters.type = query.type;

      const page = parseInt(query.page, 10) || 1;
      const limit = parseInt(query.limit, 10) || 10;
      const sort = query.sort || "-createdAt";

      return await pagination({
        res,
        table: "Files",
        model: this.file,
        filters,
        page,
        limit,
        sort,
        populate: fileSchema.populate
      });
    } catch (error) {
      handlers.logger.error({
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to load files"
      });
    }
  }

  async createFile(req, res) {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        handlers.logger.failed({ message: "No files uploaded" });

        return handlers.response.failed({
          res,
          message: "No files uploaded"
        });
      }

      const user_id = req.user._id;
      const filesToSave = [];

      for (const fieldname in req.files) {
        req.files[fieldname].forEach((file) => {
          filesToSave.push({
            user_id,
            name: file.originalname,
            field: file.fieldname,
            type: file.mimetype,
            size: file.size,
            path: file.path
          });
        });
      }

      handlers.logger.success({
        message: `Uploaded ${filesToSave.length} file(s) successfully`,
        data: filesToSave
      });

      return handlers.response.success({
        res,
        message: "Files uploaded successfully",
        data: filesToSave
      });
    } catch (error) {
      handlers.logger.error({
        message: error
      });

      return handlers.response.error({
        res,
        message: "Failed to upload files"
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { user: current_user, params } = req;

      const { file_id } = params;

      const file = await this.file.findOne({
        user_id: current_user._id,
        _id: file_id
      });

      if (!file) {
        return handlers.response.failed({ res, message: "File not found" });
      }

      const filePath = path.resolve(file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await this.file.findByIdAndDelete(file_id);

      handlers.logger.success({ message: "File deleted successfully" });
      return handlers.response.success({
        res,
        message: "File deleted successfully"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
