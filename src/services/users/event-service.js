// Cleaned and Updated Event Service

const Event = require("../../models/Event");
const User = require("../../models/User");
const EventMember = require("../../models/EventMembers");
const EventInvites = require("../../models/EventInvites");
const Notification = require("../../models/Notification");

const eventSchema = require("../../schemas/event-schema");
const eventMemberSchema = require("../../schemas/event-member-schema");
const eventInviteSchema = require("../../schemas/event-invite-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class EventService {
  constructor() {
    this.user = User;
    this.event = Event;
    this.eventMember = EventMember;
    this.eventInvite = EventInvites;
    this.notification = Notification;
  }

  async getEvents(req, res) {
    try {
      const { query } = req;
      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.userId) filters.userId = query.userId;
      if (query.title) filters.title = { $regex: query.title, $options: "i" };
      if (query.type) filters.type = query.type;
      if (query.isReported !== undefined) filters.isReported = query.isReported;

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
        $inc: { totalEvents: 1 }
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
      if (!existingEvent)
        return handlers.response.unavailable({
          res,
          message: "No event found"
        });

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
      const user = req.user;
      const existingEvent = await this.event.findById(eventId);
      if (!existingEvent)
        return handlers.response.failed({ res, message: "No event found" });

      await this.event.findByIdAndDelete(eventId);

      user.totalEvents - +1;
      await user.save();

      return handlers.response.success({
        res,
        message: "Event deleted successfully"
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async joinEvent(req, res) {
    try {
      const { user, params } = req;
      const { firstName, lastName } = user;
      const { eventId } = params;

      const event = await this.event.findById(eventId);
      if (!event)
        return handlers.response.failed({ res, message: "No event found" });

      // Prevent user from joining their own event
      if (event.userId.toString() === user._id.toString()) {
        return handlers.response.failed({
          res,
          message: "You cannot join your own event"
        });
      }

      const alreadyJoined = await this.eventMember.findOne({
        eventId,
        memberId: user._id
      });
      if (alreadyJoined)
        return handlers.response.failed({ res, message: "Already joined" });

      const newMember = await this.eventMember.create({
        eventId,
        memberId: user._id
      });
      await newMember.populate(eventMemberSchema.populate);

      await this.event.findByIdAndUpdate(eventId, {
        $inc: { totalMembers: 1 }
      });

      await this.notification.create({
        senderId: user._id,
        receiverId: event.userId,
        type: "new-member",
        message: `${firstName} ${lastName} joined your event: ${event.title}`,
        metadata: event
      });

      return handlers.response.success({
        res,
        message: "Joined event successfully",
        data: newMember
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async sendEventInvitation(req, res) {
    try {
      const { eventId, receiverId } = req.body;
      const { _id: senderId, firstName, lastName } = req.user;

      const [event, receiver] = await Promise.all([
        this.event.findById(eventId),
        this.user.findById(receiverId)
      ]);

      if (!event || !receiver)
        return handlers.response.failed({
          res,
          message: "Invalid event or receiver ID"
        });

      const existing = await this.eventInvite.findOne({ eventId, receiverId });

      if (existing) {
        if (existing.status === "pending")
          return handlers.response.failed({ res, message: "Already invited" });
        if (existing.status === "accepted")
          return handlers.response.failed({ res, message: "Already a member" });
      }

      const newInvite = await this.eventInvite.create({
        eventId,
        senderId,
        receiverId
      });

      await this.notification.create({
        senderId,
        receiverId,
        type: "invitation",
        message: `${firstName} ${lastName} invited you to: ${event.title}`,
        metadata: event
      });

      await this.event.findByIdAndUpdate(eventId, {
        $inc: { totalInvites: 1 }
      });

      return handlers.response.success({
        res,
        message: "Invitation sent",
        data: newInvite
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getEventInvitedUsers(req, res) {
    try {
      const { eventId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      return await pagination({
        res,
        table: "Event invites",
        model: this.eventInvite,
        filters: { eventId, senderId: req.user._id },
        page,
        limit,
        populate: eventInviteSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async getJoinedEvents(req, res) {
    try {
      const { query } = req;
      const filters = {};

      if (query._id) filters._id = query._id;
      if (query.eventId) filters.eventId = query.eventId;
      if (query.memberId) filters.memberId = query.memberId;

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      return await pagination({
        res,
        table: "Joined events",
        model: this.eventMember,
        filters,
        page,
        limit,
        populate: eventMemberSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new EventService();
