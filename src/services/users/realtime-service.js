const Event = require("../../models/Event");
const EventArrivedMembers = require("../../models/EventArrivedMembers");
const EventGoingMembers = require("../../models/EventGoingMembers");
const EventInvitedMembers = require("../../models/EventInvitedMembers");
const User = require("../../models/User");
const UserRatings = require("../../models/UserRatings");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
    this.event = Event;
    this.eventArrivedMembers = EventArrivedMembers;
    this.eventInvitedMembers = EventInvitedMembers;
    this.eventGoingMembers = EventGoingMembers;
    this.userRatings = UserRatings;
  }

  async getRealTimeStatistics(req, res) {
    try {
      const { event_id, location, radius } = req.body;

      // Fetch event details
      const event = await this.event.findById(event_id, {
        total_going: 1,
        total_arrived: 1,
        total_invited: 1
      });

      if (!event) {
        return handlers.response.unavailable({
          res,
          message: "No event found"
        });
      }

      // Fetch total users within the given radius
      let totalUsersWithinRadius = 0;
      if (location?.coordinates && radius) {
        const usersWithinRadius = await this.eventGoingMembers.aggregate([
          { $match: { event_id } },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_id"
            }
          },
          { $unwind: "$user_id" },
          {
            $match: {
              "user_id.location.coordinates": { $type: "array", $ne: [] },
              "user_id.location": {
                $geoWithin: {
                  $centerSphere: [location.coordinates, radius / 6378.1]
                }
              }
            }
          },
          { $count: "totalUsersWithinRadius" }
        ]);

        totalUsersWithinRadius = usersWithinRadius.length
          ? usersWithinRadius[0].totalUsersWithinRadius
          : 0;
      }

      // Prepare response data
      const responseData = {
        total_invited: event.total_invited,
        total_going: event.total_going,
        total_arrived: event.total_arrived,
        total_users_within_radius: totalUsersWithinRadius
      };

      return handlers.response.success({
        res,
        message: "Event statistics retrieved successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async arrived(req, res) {
    try {
      const { user: current_user, body } = req;
      const { event_id } = body;

      const eventArrived = await this.eventArrivedMembers.findOne({
        user_id: current_user._id
      });

      if (eventArrived) {
        handlers.logger.failed({ message: "Already arrived" });
        return handlers.response.failed({ res, message: "Already arrived" });
      }

      await this.eventArrivedMembers.create({
        user_id: current_user._id,
        event_id: event_id
      });

      current_user.total_arrived += 1;
      await current_user.save();

      handlers.logger.success({
        message: "Arrived"
      });

      return handlers.response.success({
        res,
        message: "Arrived"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async optOut(req, res) {
    try {
      const { user: current_user, body } = req;
      const { event_id, rated_to, rating, review } = body;

      const userId = current_user._id;

      await this.userRatings.create({
        user_id: userId,
        event_id,
        rated_to,
        rating,
        review
      });

      const arrivedResult = await this.eventArrivedMembers.findOneAndDelete({
        user_id: userId,
        event_id
      });
      if (arrivedResult) {
        await this.event.updateOne(
          { _id: event_id },
          { $inc: { total_arrived: -1 } }
        );
      }

      const goingResult = await this.eventGoingMembers.findOneAndDelete({
        user_id: userId,
        event_id
      });
      if (goingResult) {
        await this.event.updateOne(
          { _id: event_id },
          { $inc: { total_going: -1 } }
        );
      }

      const invitedResult = await this.eventInvitedMembers.findOneAndDelete({
        user_id: userId,
        event_id
      });
      if (invitedResult) {
        await this.event.updateOne(
          { _id: event_id },
          { $inc: { total_invited: -1 } }
        );
      }

      handlers.logger.success({
        message: "Opted out"
      });

      return handlers.response.success({
        res,
        message: "Opted out"
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
