const Event = require("../../models/Event");
const Report = require("../../models/Report");
const reportSchema = require("../../schemas/report-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.event = Event;
    this.report = Report;
  }

  async getReports(req, res) {
    try {
      const { user: current_user, params, query } = req;

      // Determine filters using ternary operators
      const filters = query;

      // Extract pagination and sorting options with defaults
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const sort = query.sort || "-createdAt";

      console.log({ filters });

      // Call the pagination utility
      await pagination({
        res,
        table: "Reports",
        model: this.report,
        filters,
        page,
        limit,
        sort,
        populate: reportSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createReport(req, res) {
    try {
      const { user: current_user, params } = req;
      const { event_id } = params;

      let existing_report = await this.report.findOne({ event_id });

      const event = await this.event.findById(event_id);

      if (!existing_report) {
        // Create a new report if none exists
        existing_report = new this.report({
          event_id: event._id,
          reported_by: [current_user._id]
        });
      } else {
        // Prevent duplicate reports from the same user
        if (existing_report.reported_by.includes(current_user._id.toString())) {
          handlers.logger.failed({
            message: "You have already reported this event"
          });
          return handlers.response.failed({
            res,
            message: "You have already reported this event"
          });
        }

        // Add the user to the reported_by array
        existing_report.reported_by.push(current_user._id);
      }

      event.is_reported = true;
      await event.save();

      await existing_report.save();
      await existing_report.populate(reportSchema.populate);

      handlers.logger.success({
        message: "Event reported"
      });

      return handlers.response.success({
        res,
        message: "Event reported"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async deleteReport(req, res) {
    try {
      const { user: current_user, params } = req;
      const { event_id } = params;

      // Ensure only admins can delete reports
      if (current_user.role !== "admin") {
        handlers.logger.failed({
          message: "Unauthorized: Only admins can delete reports"
        });
        return handlers.response.unauthorized({
          res,
          message: "Unauthorized: Only admins can delete reports"
        });
      }

      const existing_report = await this.report.findOne({ event_id });

      if (!existing_report) {
        handlers.logger.failed({
          message: "No report found for this event"
        });
        return handlers.response.failed({
          res,
          message: "No report found for this event"
        });
      }

      // Delete the report
      await this.report.deleteOne({ _id: existing_report._id });

      // Update event to mark as not reported
      await this.event.updateOne({ _id: event_id }, { is_reported: false });

      handlers.logger.success({
        message: "Report deleted successfully by admin"
      });
      return handlers.response.success({
        res,
        message: "Report deleted successfully by admin"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
