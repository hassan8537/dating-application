const Event = require("../../models/Event");
const User = require("../../models/User");
const eventSchema = require("../../schemas/event-schema");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");
const JoinedEvent = require("../../models/JoinedEvent");
const joinedEventSchema = require("../../schemas/joined-event-schema");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
    this.joinedEvent = JoinedEvent;
  }

  // Events
  async getEvents(req, res) {
    try {
      const { query } = req;

      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.userId) filters.userId = query.userId;
      if (query.title) filters.title = { $regex: query.title, $options: "i" };
      if (query.type) filters.type = query.type;
      if (query.isReported) filters.isReported = query.isReported;

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      return await pagination({
        res,
        table: "Events",
        model: this.event,
        filters,
        page,
        limit,
        populate: eventSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
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
      return handlers.response.error({ res, message: error });
    }
  }

  async updateEvent(req, res) {
    try {
      const { user, params, body } = req;
      const { eventId } = params;

      const existingEvent = await this.event.findOne({
        _id: eventId,
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
      return handlers.response.error({ res, message: error });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;

      const existingEvent = await this.event.findById(eventId);

      if (!existingEvent)
        return handlers.response.failed({ res, message: "No event found" });

      await this.event.findByIdAndDelete(eventId);

      return handlers.response.success({
        res,
        message: "Event deleted successfully"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  // Joined Events
  async getJoinedEvents(req, res) {
    try {
      const { query } = req;
      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.userId) filters.userId = query.userId;
      if (query.eventId) filters.eventId = query.eventId;

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      return await pagination({
        res,
        table: "Joined events",
        model: this.joinedEvent,
        page,
        limit,
        filters,
        populate: joinedEventSchema.populate
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error });
    }
  }

  async joinEvent(req, res) {
    try {
      const { user, params } = req;

      const { eventId } = params;

      const existingEvent = await this.event.findById(eventId);

      if (!existingEvent)
        return handlers.response.failed({ res, message: "No event found" });

      const existingJoinedEvent = await this.joinedEvent.findOne({
        userId: user._id,
        eventId: existingEvent._id
      });

      if (existingJoinedEvent)
        return handlers.response.failed({
          res,
          message: "You already are a member of this event"
        });

      const newMember = new this.joinedEvent({
        userId: user._id,
        eventId: existingEvent._id
      });

      await newMember.save();
      await newMember.populate(joinedEventSchema.populate);

      return handlers.response.success({
        res,
        message: "Event joined successfully",
        data: newMember
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
