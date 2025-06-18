const FavouriteUser = require("../../models/Favourite");
const SwipeLeft = require("../../models/SwipeLeft");
const SwipeRight = require("../../models/SwipeRight");
const User = require("../../models/User");
const VisitedUser = require("../../models/VisitedUser");
const {
  likedUserSchema,
  visitedUserSchema,
  favouriteUserSchema,
  passedUserSchema
} = require("../../schemas/explore-schema");
const { handlers } = require("../../utilities/handlers/handlers");
const pagination = require("../../utilities/pagination/pagination");

class Service {
  constructor() {
    this.user = User;
    this.visitedUser = VisitedUser;
    this.favouriteUser = FavouriteUser;
    this.passedUser = SwipeLeft;
    this.likedUser = SwipeRight;
  }

  async profilesLikedMe(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

      const filters = { likedUser: user._id };

      return await pagination({
        res: res,
        table: "Profiles liked me",
        model: this.likedUser,
        filters: filters,
        page: page,
        limit: limit,
        populate: likedUserSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async profilesVisitedMe(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

      const filters = { visitedUser: user._id };

      return await pagination({
        res: res,
        table: "Profile visited me",
        model: this.visitedUser,
        filters: filters,
        page: page,
        limit: limit,
        populate: visitedUserSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async favouriteProfiles(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

      const filters = { userId: user._id };

      return await pagination({
        res: res,
        table: "Favourite profiles",
        model: this.favouriteUser,
        filters: filters,
        page: page,
        limit: limit,
        populate: favouriteUserSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async profilesIPassed(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

      const filters = { userId: user._id };

      return await pagination({
        res: res,
        table: "Passed profiles",
        model: this.passedUser,
        filters: filters,
        page: page,
        limit: limit,
        populate: passedUserSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }

  async profilesILiked(req, res) {
    try {
      const user = req.user;

      const { page, limit } = req.query;

      const filters = { userId: user._id };

      return await pagination({
        res: res,
        table: "Liked profiles",
        model: this.likedUser,
        filters: filters,
        page: page,
        limit: limit,
        populate: likedUserSchema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error });
    }
  }
}

module.exports = new Service();
