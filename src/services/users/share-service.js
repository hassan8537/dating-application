const User = require("../../models/User");
const Event = require("../../models/Event");
const EventShares = require("../../models/EventShares");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
    this.eventShares = EventShares;
  }

  async manageEventShares(req, res) {
    try {
      const { event_id } = req.params;
      const user_id = req.user._id;

      // Check if event exists
      const event = await this.event.findById(event_id);
      if (!event) {
        return handlers.response.failed({ res, message: "No event found" });
      }

      // Create a new share entry
      await this.eventShares.create({ event_id, user_id });

      // Increment total_shares count
      await this.event.updateOne(
        { _id: event_id },
        { $inc: { total_shares: 1 } }
      );

      // Fetch updated event
      const updatedEvent = await this.event.findById(event_id);

      handlers.logger.success({
        message: "Shared",
        data: updatedEvent
      });

      return handlers.response.success({
        res,
        message: "Shared",
        data: updatedEvent
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: "Failed to share event" });
    }
  }

  async getEventShares(req, res) {
    try {
      const { event_id } = req.params;
      const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

      // Convert pagination params
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Count total shares
      const totalShares = await this.eventShares.countDocuments({ event_id });

      // Fetch shares with pagination and sorting
      const shares = await this.eventShares
        .find({ event_id })
        .sort(sort)
        .skip(skip)
        .limit(pageSize);

      // Prepare response data
      const responseData = {
        results: shares,
        total_records: totalShares,
        total_pages: Math.ceil(totalShares / pageSize),
        current_page: pageNumber,
        page_size: pageSize
      };

      handlers.logger.success({
        message: "Event shares fetched successfully",
        data: responseData
      });

      return handlers.response.success({
        res,
        message: "Event shares fetched successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: "Failed to fetch event shares"
      });
    }
  }
}

module.exports = new Service();
