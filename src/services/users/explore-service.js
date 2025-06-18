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

  async getProfiles(req, res) {
    try {
      const user = req.user;
      const { type, page, limit } = req.query;

      const config = {
        likedYou: {
          model: this.likedUser,
          filters: { likedUser: user._id },
          schema: likedUserSchema,
          table: "Profiles liked me"
        },
        visitedYou: {
          model: this.visitedUser,
          filters: { visitedUser: user._id },
          schema: visitedUserSchema,
          table: "Profiles visited me"
        },
        favourited: {
          model: this.favouriteUser,
          filters: { userId: user._id },
          schema: favouriteUserSchema,
          table: "Favourited profiles"
        },
        passed: {
          model: this.passedUser,
          filters: { userId: user._id },
          schema: passedUserSchema,
          table: "Passed profiles"
        },
        liked: {
          model: this.likedUser,
          filters: { userId: user._id },
          schema: likedUserSchema,
          table: "Liked profiles"
        }
      };

      const selected = config[type];

      if (!selected) {
        return handlers.response.failed({
          res,
          message: "Invalid type provided"
        });
      }

      return await pagination({
        res,
        table: selected.table,
        model: selected.model,
        filters: selected.filters,
        page,
        limit,
        populate: selected.schema.populate
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
