import { Message, Chat, User } from "../models/index.js";
import { ApiError } from "../utils/index.js";
import { file } from "./index.js";

/**
 * Get messages from a chat
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID requesting the messages
 * @param {Object} options - Query options (limit, page)
 * @returns {Promise<Array>} - List of messages
 */
const getMessages = async (chatId, userId, options = {}) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      throw new ApiError(404, "Chat not found");
    }

    // Check if user is a participant or an admin
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isParticipant = chat.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant && user.role !== "admin") {
      throw new ApiError(403, "You do not have access to this chat");
    }

    // Set up pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const skip = (page - 1) * limit;

    // Get messages with pagination
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "sender",
        select: "firstName lastName username avatar role",
      });

    // Mark messages as read if user is not the sender
    const unreadMessages = messages.filter(
      message => 
        message.sender._id.toString() !== userId && 
        !message.readBy.includes(userId)
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(msg => msg._id) },
          readBy: { $ne: userId }
        },
        { $push: { readBy: userId } }
      );
    }

    return messages;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error fetching messages");
  }
};

/**
 * Send a new message in a chat
 * @param {string} chatId - Chat ID
 * @param {string} senderId - User ID sending the message
 * @param {string} content - Message content
 * @param {Array} attachments - Array of file paths to attach
 * @returns {Promise<Object>} - The new message
 */
const sendMessage = async (chatId, senderId, content, attachments = []) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      throw new ApiError(404, "Chat not found");
    }

    // Verify sender is a participant in the chat
    const isParticipant = chat.participants.some(
      participant => participant.toString() === senderId
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant in this chat");
    }

    // Process and upload attachments if any
    const uploadedAttachments = [];
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const uploadedUrl = await file.uploadFile(attachment, true, {
          folder: "chat-attachments",
        });
        uploadedAttachments.push(uploadedUrl);
      }
    }

    // Create the message
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content: content || "",
      attachments: uploadedAttachments,
      readBy: [senderId], // Mark as read by sender
    });

    // Update the chat's lastMessage
    chat.lastMessage = message._id;
    await chat.save();

    // Populate sender information
    await message.populate({
      path: "sender",
      select: "firstName lastName username avatar role",
    });

    return message;
  } catch (error) {
    console.log(error)
    throw new ApiError(error.statusCode || 500, error.message || "Error sending message");
  }
};

/**
 * Delete a message (soft delete)
 * @param {string} messageId - Message ID to delete
 * @param {string} userId - User ID requesting deletion
 * @returns {Promise<Object>} - The deleted message
 */
const deleteMessage = async (messageId, userId) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    // Verify the user is the sender or an admin
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (message.sender.toString() !== userId && user.role !== "admin") {
      throw new ApiError(403, "You do not have permission to delete this message");
    }

    // Soft delete the message
    message.isDeleted = true;
    await message.save();

    return message;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error deleting message");
  }
};

/**
 * Mark all messages in a chat as read by a user
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID marking messages as read
 * @returns {Promise<Object>} - Result of the operation
 */
const markChatAsRead = async (chatId, userId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      throw new ApiError(404, "Chat not found");
    }

    // Verify user is a participant
    const isParticipant = chat.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant in this chat");
    }

    // Mark all unread messages as read
    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      { $push: { readBy: userId } }
    );

    return { 
      success: true,
      messagesMarkedAsRead: result.modifiedCount
    };
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error marking chat as read");
  }
};

/**
 * Get unread message count for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Count of unread messages per chat
 */
const getUnreadMessageCount = async (userId) => {
  try {
    // Find all chats where the user is a participant
    const chats = await Chat.find({
      participants: userId,
      isActive: true,
    });

    const chatIds = chats.map(chat => chat._id);

    // Count unread messages for each chat
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          chat: { $in: chatIds },
          sender: { $ne: userId },
          readBy: { $ne: userId },
          isDeleted: false,
        }
      },
      {
        $group: {
          _id: "$chat",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the result
    const result = {
      totalUnread: 0,
      chatCounts: {}
    };

    unreadCounts.forEach(item => {
      result.chatCounts[item._id.toString()] = item.count;
      result.totalUnread += item.count;
    });

    return result;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error counting unread messages");
  }
};

export {
  getMessages,
  sendMessage,
  deleteMessage,
  markChatAsRead,
  getUnreadMessageCount
};