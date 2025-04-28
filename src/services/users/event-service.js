const Event = require("../../models/Event");
const EventLikes = require("../../models/EventLikes");
const EventGoingMembers = require("../../models/EventGoingMembers");
const EventInvitedMembers = require("../../models/EventInvitedMembers");
const User = require("../../models/User");
const eventSchema = require("../../schemas/event-schema");
const userSchema = require("../../schemas/user-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const { default: mongoose } = require("mongoose");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
    this.eventLikes = EventLikes;
    this.eventGoingMembers = EventGoingMembers;
    this.eventInvitedMembers = EventInvitedMembers;
    this.eventGoingMembers = EventGoingMembers;
  }

  async getEvents(req, res) {
    try {
      const { query, user } = req;
      const filters = {};

      ["_id", "user_id", "zip_code"].forEach((key) => {
        if (query[key]) filters[key] = query[key];
      });

      if (query.name) {
        filters.title = { $regex: query.name, $options: "i" };
      }

      if (query.is_reported) {
        filters.is_reported = is_reported;
      }

      if (query.location) {
        filters["location.name"] = { $regex: query.location, $options: "i" };
      }

      if (query.hide_my_events === "true") {
        filters.user_id = { $ne: user._id };
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

      if (query.age_group) {
        const [minAge, maxAge] = query.age_group.split("-").map(Number);
        const userIds = await this.user
          .find({
            age: { $gte: minAge, $lte: maxAge }
          })
          .distinct("_id");
        filters.user_id = { $in: userIds };
      }

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const skip = (page - 1) * limit;

      // Pre-fetch user interactions to filter on is_joined if needed
      const allEventIds = await this.event.find({}, { _id: 1 }).lean();
      const eventIds = allEventIds.map((e) => e._id.toString());

      const userJoinedEvents = await this.eventGoingMembers
        .find({ event_id: { $in: eventIds }, user_id: user._id })
        .distinct("event_id")
        .then((ids) => ids.map((id) => id.toString()));

      // Apply is_joined filter before fetching events
      if (query.is_joined === "true") {
        filters._id = { $in: userJoinedEvents };
      } else if (query.is_joined === "false") {
        filters._id = { $nin: userJoinedEvents };
      }

      // Now fetch events with applied filters
      const [totalCount, events] = await Promise.all([
        this.event.countDocuments(filters),
        this.event
          .find(filters)
          .skip(skip)
          .limit(limit)
          .populate(eventSchema.populate)
      ]);

      const filteredEventIds = events.map((event) => event._id.toString());

      const [userLikedEvents, topGoingUsers] = await Promise.all([
        this.eventLikes
          .find({ event_id: { $in: filteredEventIds }, user_id: user._id })
          .distinct("event_id")
          .then((ids) => ids.map((id) => id.toString())),
        this.eventGoingMembers.aggregate([
          {
            $match: {
              event_id: {
                $in: filteredEventIds.map(
                  (id) => new mongoose.Types.ObjectId(id)
                )
              }
            }
          },
          { $group: { _id: "$event_id", users: { $push: "$user_id" } } },
          {
            $project: {
              event_id: "$_id",
              top_users: { $slice: ["$users", 3] }
            }
          }
        ])
      ]);

      const userIds = topGoingUsers.flatMap((e) =>
        e.top_users.map((id) => id.toString())
      );

      const userDetails = userIds.length
        ? await this.user
            .find({ _id: { $in: userIds } })
            .populate(userSchema.populate)
        : [];

      const userMap = Object.fromEntries(
        userDetails.map((user) => [user._id.toString(), user.toObject()])
      );

      const results = events.map((event) => {
        const eventIdStr = event._id.toString();
        const topUserEntry = topGoingUsers.find(
          (e) => e.event_id.toString() === eventIdStr
        );
        const topUsers = topUserEntry
          ? topUserEntry.top_users
              .map((id) => userMap[id.toString()] || null)
              .filter(Boolean)
          : [];

        return {
          ...event.toObject(),
          is_joined: userJoinedEvents.includes(eventIdStr),
          is_liked: userLikedEvents.includes(eventIdStr),
          top_three_going_users: topUsers
        };
      });

      const data = {
        results,
        total_records: totalCount,
        total_pages: Math.ceil(totalCount / limit),
        current_page: page,
        page_size: limit
      };

      handlers.logger.success({ message: "Events fetched successfully", data });
      return handlers.response.success({
        res,
        message: "Events fetched successfully",
        data
      });
    } catch (error) {
      handlers.logger.error({ message: error.message });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async createEvent(req, res) {
    try {
      const { user, body } = req;
      const now = new Date();

      const eventStart = new Date(body.start_time);
      const eventEnd = new Date(body.end_time);

      if (eventStart <= now) {
        return handlers.response.failed({
          res,
          message: "Start time must be in the future"
        });
      }

      if (eventEnd <= eventStart) {
        return handlers.response.failed({
          res,
          message: "End time must be after start time"
        });
      }

      const overlappingEvent = await this.event.findOne({
        user_id: user._id,
        date: body.date
      });

      if (overlappingEvent) {
        return handlers.response.failed({
          res,
          message: "An event already exists on this day"
        });
      }

      const newEvent = new this.event({ user_id: user._id, ...body });

      await newEvent.save();
      await newEvent.populate(eventSchema.populate);

      // Increment total_events in the user model
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

      // Ensure event exists
      const existingEvent = await this.event.findOne({
        _id: event_id,
        user_id: user._id
      });

      if (!existingEvent) {
        return handlers.response.unavailable({
          res,
          message: "No event found"
        });
      }

      // Ensure start time is in the future
      if (body.start_time && new Date(body.start_time) <= new Date()) {
        return handlers.response.failed({
          res,
          message: "Start time must be in the future"
        });
      }

      // Ensure end time is after start time
      if (
        body.start_time &&
        body.end_time &&
        new Date(body.end_time) <= new Date(body.start_time)
      ) {
        return handlers.response.failed({
          res,
          message: "End time must be after start time"
        });
      }

      // Check for overlapping events if time is updated
      if (body.start_time && body.end_time) {
        const overlappingEvent = await this.event.findOne({
          user_id: user._id,
          _id: { $ne: event_id },
          $or: [
            {
              start_time: {
                $lt: new Date(body.end_time),
                $gte: new Date(body.start_time)
              }
            },
            {
              end_time: {
                $gt: new Date(body.start_time),
                $lte: new Date(body.end_time)
              }
            },
            {
              start_time: { $lte: new Date(body.start_time) },
              end_time: { $gte: new Date(body.end_time) }
            }
          ]
        });

        if (overlappingEvent) {
          return handlers.response.failed({
            res,
            message: "An event already exists within this time frame"
          });
        }
      }

      // Update event
      const updatedEvent = await this.event
        .findByIdAndUpdate(event_id, body, {
          new: true
        })
        .populate(eventSchema.populate);

      return handlers.response.success({
        res,
        message: "Event updated successfully",
        data: updatedEvent
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { user: current_user, params } = req;
      const { event_id } = params; // Get event ID from params

      if (!event_id) {
        handlers.logger.failed({
          message: "Event ID is required"
        });
        return handlers.response.failed({
          res,
          message: "Event ID is required"
        });
      }

      // Find the event to delete
      const existing_event = await this.event.findOne({
        _id: event_id,
        user_id: current_user._id
      });

      if (!existing_event) {
        handlers.logger.unavailable({
          message: "No events found"
        });
        return handlers.response.unavailable({
          res,
          message: "No events found"
        });
      }

      // Delete the event
      const deleted_event = await this.event
        .findByIdAndDelete(existing_event._id)
        .populate(eventSchema.populate);

      // Decrease the total_events count in the User model
      await this.user.findByIdAndUpdate(current_user._id, {
        $inc: { total_events: -1 }
      });

      handlers.logger.success({
        message: "Event deleted successfully",
        data: deleted_event
      });
      return handlers.response.success({
        res,
        message: "Event deleted successfully",
        data: deleted_event
      });
    } catch (error) {
      return handlers.response.error({ res, error });
    }
  }

  async joinEvent(req, res) {
    try {
      const current_user_id = req.user._id;
      const { event_id } = req.body;

      const event = await this.event.findById(event_id);
      if (!event) {
        handlers.logger.unavailable({
          object_type: "join-event",
          message: "Event not found"
        });
        return handlers.response.unavailable({
          res,
          message: "Event not found"
        });
      }

      // Prevent host from joining
      if (event.user_id.toString() === current_user_id.toString()) {
        handlers.logger.failed({
          object_type: "join-event",
          message: "Host cannot join the event"
        });
        return handlers.response.failed({
          res,
          message: "Host cannot join the event"
        });
      }

      // Check if user is already in EventGoingMembers
      const alreadyJoined = await this.eventGoingMembers.findOne({
        event_id,
        user_id: current_user_id
      });

      if (alreadyJoined) {
        handlers.logger.failed({
          message: "Already joined"
        });
        return handlers.response.failed({ res, message: "Already joined" });
      }

      // Add user to EventGoingMembers
      await this.eventGoingMembers.create({
        event_id,
        user_id: current_user_id
      });

      // Increment total_going in the Event model
      await this.event.updateOne(
        { _id: event_id },
        { $inc: { total_going: 1 } }
      );

      handlers.logger.success({
        message: "Joined"
      });

      return handlers.response.success({ res, message: "Joined" });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async inviteMember(req, res) {
    try {
      const current_user_id = req.user._id;
      const { user_id, event_id } = req.body;

      const user = await this.user.findById(user_id);
      if (!user) {
        handlers.logger.unavailable({ message: "No user found" });
        return handlers.response.unavailable({ res, message: "No user found" });
      }

      const event = await this.event.findById(event_id);
      if (!event) {
        handlers.logger.unavailable({ message: "No event found" });
        return handlers.response.unavailable({
          res,
          message: "No event found"
        });
      }

      // Prevent self-invitation
      if (current_user_id.toString() === user_id.toString()) {
        handlers.logger.failed({ message: "You cannot invite yourself" });
        return handlers.response.failed({
          res,
          message: "You cannot invite yourself"
        });
      }

      // Check if the user is already invited
      const alreadyInvited = await this.eventInvitedMembers.findOne({
        event_id,
        user_id
      });
      if (alreadyInvited) {
        handlers.logger.failed({ message: "User is already invited" });
        return handlers.response.failed({
          res,
          message: "User is already invited"
        });
      }

      // Add to invited members collection
      await this.eventInvitedMembers.create({ event_id, user_id });

      // Increment total_invited count in the Event model
      await this.event.updateOne(
        { _id: event_id },
        { $inc: { total_invited: 1 } }
      );

      handlers.logger.success({ message: "Invited" });
      return handlers.response.success({
        res,
        message: "Invited"
      });
    } catch (error) {
      handlers.logger.error({ message: error.message });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async likeEvent(req, res) {
    try {
      const { user, params } = req;
    } catch (error) {
      handlers.logger.error({ message: error.message });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
