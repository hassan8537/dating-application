const Event = require("../../models/Event");
const User = require("../../models/User");
const eventSchema = require("../../schemas/event-schema");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const { default: mongoose } = require("mongoose");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
  }

  async getEvents(req, res) {
    try {
      const { query, user } = req;
      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.user_id) filters.userId = query.user_id;

      if (query.name) {
        filters.title = { $regex: query.name, $options: "i" };
      }

      if (query.is_reported) {
        filters.isReported = query.is_reported === true;
      }

      if (query.location) {
        filters["location.name"] = { $regex: query.location, $options: "i" };
      }

      if (query.nearby_location) {
        const [lng, lat, maxDistance] = query.nearby_location
          .split(",")
          .map(Number);
        filters.location = {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: maxDistance
          }
        };
      }

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      return await pagination({
        res,
        table: "Events",
        model: this.event,
        page,
        limit,
        sort,
        populate: eventSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error.message });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createEvent(req, res) {
    try {
      const { user, body } = req;

      const newEvent = new this.event({ userId: user._id, ...body });
      await newEvent.save();
      await newEvent.populate(eventSchema.populate);

      await this.user.findByIdAndUpdate(user._id, {
        $inc: { total_events: 1 }
      });

      return handlers.response.success({
        res,
        message: "Event created successfully",
        data: newEvent
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const { user, params, body } = req;
      const { event_id } = params;

      const existingEvent = await this.event.findOne({
        _id: event_id,
        userId: user._id
      });

      if (!existingEvent) {
        return handlers.response.unavailable({
          res,
          message: "No event found"
        });
      }

      Object.assign(existingEvent, body);
      await existingEvent.save();
      await existingEvent.populate(eventSchema.populate);

      return handlers.response.success({
        res,
        message: "Event updated successfully",
        data: existingEvent
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
