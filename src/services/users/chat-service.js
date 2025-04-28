const Chat = require("../../models/Chat");
const User = require("../../models/User");
const chatSchema = require("../../schemas/chat-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.chat = Chat;
    this.user = User;
  }

  async getInbox(req, res) {
    try {
      const { user_id } = req.query;

      const user = await this.user.findById(user_id);
      if (!user) {
        handlers.logger.unavailable({ message: "User not found" });
        return handlers.response.unavailable({
          res,
          message: "User not found"
        });
      }

      const inbox = await this.chat.aggregate([
        {
          $match: {
            $or: [{ sender_id: user._id }, { receiver_id: user._id }]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              sender: "$sender_id",
              receiver: "$receiver_id"
            },
            latestMessage: { $first: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: "$latestMessage._id",
            sender_id: "$latestMessage.sender_id",
            receiver_id: "$latestMessage.receiver_id",
            text: "$latestMessage.text",
            createdAt: "$latestMessage.createdAt"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "sender_id",
            foreignField: "_id",
            as: "sender_id"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "receiver_id",
            foreignField: "_id",
            as: "receiver_id"
          }
        },
        {
          $unwind: "$sender_id"
        },
        {
          $unwind: "$receiver_id"
        }
      ]);

      handlers.logger.success({
        message: "Inbox retrieved successfully",
        data: inbox
      });
      return handlers.response.success({
        res,
        message: "Inbox retrieved successfully",
        data: inbox
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.response.error({ res, message: error.message });
    }
  }

  async newChat(data) {
    try {
      const { sender_id, receiver_id, text } = data;

      const [sender, receiver] = await Promise.all([
        this.user.findById(sender_id),
        this.user.findById(receiver_id)
      ]);

      if (!sender) {
        handlers.logger.unavailable({ message: "No sender found" });
        return handlers.event.unavailable({
          object_type: "new-chat",
          message: "No sender found"
        });
      }

      if (!receiver) {
        handlers.logger.unavailable({ message: "No receiver found" });
        return handlers.event.unavailable({
          object_type: "new-chat",
          message: "No receiver found"
        });
      }

      // Create new chat message
      const newChat = new this.chat({
        sender_id: sender._id,
        receiver_id: receiver._id,
        text
      });

      await newChat.save();
      await newChat.populate(chatSchema.populate);

      handlers.logger.success({
        message: "New chat created successfully",
        data: newChat
      });

      return handlers.event.success({
        object_type: "new-chat",
        message: "New chat created successfully",
        data: newChat
      });
    } catch (error) {
      handlers.logger.error({ message: error });

      return handlers.event.error({
        object_type: "new-chat",
        message: error.message
      });
    }
  }

  async getChats(data) {
    try {
      const { sender_id, receiver_id } = data;

      const [sender, receiver] = await Promise.all([
        await this.user.findById(sender_id),
        await this.user.findById(receiver_id)
      ]);

      if (!sender) {
        handlers.logger.unavailable({ message: "No sender found" });
        return handlers.event.unavailable({
          object_type: "chats",
          message: "No sender found"
        });
      }

      if (!receiver) {
        handlers.logger.unavailable({ message: "No receiver found" });
        return handlers.event.unavailable({
          object_type: "chats",
          message: "No receiver found"
        });
      }

      const chats = await this.chat
        .find({
          $or: [
            { sender_id: sender._id, receiver_id: receiver._id },
            { sender_id: receiver._id, receiver_id: sender._id }
          ]
        })
        .populate(chatSchema.populate);

      handlers.logger.success({
        message: "Chats retrieved successfully",
        data: chats
      });
      return handlers.event.success({
        object_type: "chats",
        message: "Chats retrieved successfully",
        data: chats
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.event.error({
        object_type: "chats",
        message: error.message
      });
    }
  }
}

module.exports = new Service();
