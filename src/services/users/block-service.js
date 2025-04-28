const userSchema = require("../../schemas/user-schema");
const User = require("../../models/User");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.user = User;
  }

  async toggleBlockUnblockUser(req, res) {
    try {
      const { user: current_user, body } = req;
      const { target_user_id } = body;

      const targetUser = await this.user.findById(target_user_id);
      if (!targetUser) {
        return handlers.response.failed({
          res,
          message: "No user found"
        });
      }

      const user = await this.user.findById(current_user._id);

      if (user._id.toString() === target_user_id.toString()) {
        handlers.logger.failed({
          message: `You cannot block yourself`
        });
        return handlers.response.failed({
          res,
          message: `You cannot block yourself`
        });
      }

      const isBlocked = user?.block?.includes(target_user_id);
      let update;

      if (isBlocked) {
        update = { $pull: { block: target_user_id } };
      } else {
        update = { $addToSet: { block: target_user_id } };
      }

      await this.user.findByIdAndUpdate(current_user._id, update);

      handlers.logger.success({
        message: `User has been ${isBlocked ? "unblocked" : "blocked"} successfully`,
        data: {
          user_id: target_user_id,
          status: isBlocked ? "unblocked" : "blocked"
        }
      });

      return handlers.response.success({
        res,
        message: `User has been ${isBlocked ? "unblocked" : "blocked"} successfully`,
        data: {
          user_id: target_user_id,
          status: isBlocked ? "unblocked" : "blocked"
        }
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: error.message
      });
    }
  }

  async getBlockedUsers(req, res) {
    try {
      const { user: current_user, query } = req;
      const { page = 1, limit = 10 } = query;

      const user = await this.user.findById(current_user._id).select("block");

      const totalRecords = user.block.length;
      const totalPages = Math.ceil(totalRecords / limit);
      const currentPage = Number(page);
      const pageSize = Number(limit);

      const paginatedBlockedIds = user.block.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      const blockedUsers = await this.user
        .find({ _id: { $in: paginatedBlockedIds } })
        .populate(userSchema.populate);

      return handlers.response.success({
        res,
        message: "Blocked users fetched successfully",
        data: {
          results: blockedUsers,
          total_records: totalRecords,
          total_pages: totalPages,
          current_page: currentPage,
          page_size: pageSize
        }
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({
        res,
        message: error.message
      });
    }
  }
}

module.exports = new Service();
