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
      const { type, page = 1, limit = 10 } = req.query;

      const config = {
        likedYou: {
          model: this.likedUser,
          filters: { likedUser: user._id },
          schema: likedUserSchema,
          table: "Profiles liked me",
          key: "userId"
        },
        visitedYou: {
          model: this.visitedUser,
          filters: { visitedUser: user._id },
          schema: visitedUserSchema,
          table: "Profiles visited me",
          key: "userId"
        },
        favourited: {
          model: this.favouriteUser,
          filters: { userId: user._id },
          schema: favouriteUserSchema,
          table: "Favourited profiles",
          key: "favouritedUser"
        },
        passed: {
          model: this.passedUser,
          filters: { userId: user._id },
          schema: passedUserSchema,
          table: "Passed profiles",
          key: "passedUser"
        },
        liked: {
          model: this.likedUser,
          filters: { userId: user._id },
          schema: likedUserSchema,
          table: "Liked profiles",
          key: "likedUser"
        }
      };

      const selected = config[type];

      if (!selected) {
        return handlers.response.failed({
          res,
          message: "Invalid type provided"
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalRecords = await selected.model.countDocuments(
        selected.filters
      );

      const records = await selected.model
        .find(selected.filters)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .populate(selected.schema.populate);

      // Replace target key with `profile`
      const genericResults = records.map((item) => {
        const profile = item[selected.key];
        const cloned = { ...item._doc, profile };
        delete cloned[selected.key];
        return cloned;
      });

      return handlers.response.success({
        res,
        message: `${selected.table} retrieved successfully.`,
        data: {
          results: genericResults,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: parseInt(page),
          pageSize: parseInt(limit)
        }
      });
    } catch (error) {
      return handlers.response.error({ res, message: error.message });
    }
  }
}

module.exports = new Service();
