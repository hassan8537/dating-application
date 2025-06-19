const Chat = require("../../models/Chat");
const User = require("../../models/User");
const chatSchema = require("../../schemas/chat-schema");
const { handlers } = require("../../utilities/handlers/handlers");

class Service {
  constructor() {
    this.chat = Chat;
    this.user = User;
  }

  async getInbox(data) {
    try {
      const { userId, page = 1, limit = 10 } = data;

      const user = await this.user.findById(userId);
      if (!user) {
        handlers.logger.unavailable({ message: "User not found" });
        return handlers.event.unavailable({
          object_type: "inbox",
          message: "User not found"
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const inbox = await this.chat.aggregate([
        {
          $match: {
            $or: [{ senderId: user._id }, { receiverId: user._id }]
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              sender: "$senderId",
              receiver: "$receiverId"
            },
            latestMessage: { $first: "$$ROOT" }
          }
        },
        { $sort: { "latestMessage.createdAt": -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $project: {
            _id: "$latestMessage._id",
            senderId: "$latestMessage.senderId",
            receiverId: "$latestMessage.receiverId",
            text: "$latestMessage.text",
            createdAt: "$latestMessage.createdAt"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "sender"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiver"
          }
        },
        { $unwind: "$sender" },
        { $unwind: "$receiver" }
      ]);

      // Add unread count for each thread
      const inboxWithUnread = await Promise.all(
        inbox.map(async (chat) => {
          const otherUserId =
            String(chat.senderId._id) === String(user._id)
              ? chat.receiverId._id
              : chat.senderId._id;

          const unreadCount = await this.chat.countDocuments({
            senderId: otherUserId,
            receiverId: user._id,
            status: "unread"
          });

          return {
            ...chat,
            unreadCount
          };
        })
      );

      handlers.logger.success({
        message: "Inbox retrieved successfully",
        data: inboxWithUnread
      });

      return handlers.event.success({
        object_type: "inbox",
        message: "Inbox retrieved successfully",
        data: {
          results: inboxWithUnread,
          pagination: {
            currentPage: parseInt(page),
            pageSize: parseInt(limit),
            count: inboxWithUnread.length
          }
        }
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.event.error({
        object_type: "inbox",
        message: error.message
      });
    }
  }

  async newChat(data) {
    try {
      const { senderId, receiverId, text, files } = data;

      const [sender, receiver] = await Promise.all([
        this.user.findById(senderId),
        this.user.findById(receiverId)
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

      const newChat = new this.chat({
        senderId: sender._id,
        receiverId: receiver._id,
        text: text,
        files: files
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

  async getChats(req, res) {
    try {
      const { senderId, receiverId, page = 1, limit = 10 } = req.query;

      const [sender, receiver] = await Promise.all([
        this.user.findById(senderId),
        this.user.findById(receiverId)
      ]);

      if (!sender) {
        handlers.logger.unavailable({ message: "No sender found" });
        return handlers.response.unavailable({
          res,
          message: "No sender found"
        });
      }

      if (!receiver) {
        handlers.logger.unavailable({ message: "No receiver found" });
        return handlers.response.unavailable({
          res,
          message: "No receiver found"
        });
      }

      // Update unread messages sent by receiver to read
      await this.chat.updateMany(
        {
          senderId: receiver._id,
          receiverId: sender._id,
          status: "unread"
        },
        { $set: { status: "read" } }
      );

      // Manual pagination values
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const skip = (pageNumber - 1) * pageSize;

      // Total count
      const totalChats = await this.chat.countDocuments({
        $or: [
          { senderId: sender._id, receiverId: receiver._id },
          { senderId: receiver._id, receiverId: sender._id }
        ]
      });

      // Fetch paginated chats
      const chats = await this.chat
        .find({
          $or: [
            { senderId: sender._id, receiverId: receiver._id },
            { senderId: receiver._id, receiverId: sender._id }
          ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate(chatSchema.populate);

      const responseData = {
        results: chats,
        totalRecords: totalChats,
        totalPages: Math.ceil(totalChats / pageSize),
        currentPage: pageNumber,
        pageSize
      };

      handlers.logger.success({
        message: "Chats retrieved successfully",
        data: responseData
      });

      return handlers.event.success({
        object_type: "chats",
        message: "Chats retrieved successfully",
        data: responseData
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.event.error({
        object_type: "chats",
        message: error.message
      });
    }
  }

  async chatTyping(data) {
    try {
      const { senderId, receiverId, isTyping = true } = data;

      const [sender, receiver] = await Promise.all([
        this.user.findById(senderId),
        this.user.findById(receiverId)
      ]);

      if (!sender || !receiver) {
        return handlers.event.unavailable({
          object_type: "chat-typing",
          message: "Invalid sender or receiver"
        });
      }

      return handlers.event.success({
        object_type: "chat-typing",
        message: "Typing status updated",
        data: {
          senderId,
          receiverId,
          isTyping
        }
      });
    } catch (error) {
      handlers.logger.error({ message: error });
      return handlers.event.error({
        object_type: "chat-typing",
        message: error.message
      });
    }
  }
}

module.exports = new Service();
