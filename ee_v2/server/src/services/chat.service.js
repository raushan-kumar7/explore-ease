import { Chat, User } from "../models/index.js";
import { ApiError } from "../utils/index.js";

/**
 * Get all chats for admin user
 * @param {string} userId - Admin user ID
 * @returns {Promise<Array>} - List of all chats
 */
const getAllChats = async (userId) => {
  try {
    // Verify the user is an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      throw new ApiError(403, "Only admins can access all chats");
    }

    const chats = await Chat.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants",
        select: "firstName lastName username avatar",
      })
      .populate({
        path: "lastMessage",
        select: "content attachments createdAt isDeleted",
      });

    return chats;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error fetching chats");
  }
};

/**
 * Get chats for a regular user (only their chats with admin)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of user's chats
 */
const getUserChats = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // If user is admin, get all chats
    if (user.role === "admin") {
      return getAllChats(userId);
    }

    // For regular users, find chats where they are a participant
    const chats = await Chat.find({
      participants: userId,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants",
        select: "firstName lastName username avatar role",
      })
      .populate({
        path: "lastMessage",
        select: "content attachments createdAt isDeleted",
      });

    return chats;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error fetching user chats");
  }
};

/**
 * Get a single chat by ID
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID requesting the chat
 * @returns {Promise<Object>} - Chat object
 */
const getChatById = async (chatId, userId) => {
  try {
    const chat = await Chat.findById(chatId)
      .populate({
        path: "participants",
        select: "firstName lastName username avatar role",
      })
      .populate({
        path: "lastMessage",
        select: "content attachments createdAt isDeleted",
      });

    if (!chat || !chat.isActive) {
      throw new ApiError(404, "Chat not found");
    }

    // Verify the user is a participant or an admin
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isParticipant = chat.participants.some(
      participant => participant._id.toString() === userId
    );

    if (!isParticipant && user.role !== "admin") {
      throw new ApiError(403, "You do not have access to this chat");
    }

    return chat;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error fetching chat");
  }
};

/**
 * Create a new chat between a user and admin
 * @param {string} userId - The user initiating the chat
 * @param {string} adminId - The admin's user ID (optional, will find an admin if not provided)
 * @returns {Promise<Object>} - The newly created chat
 */
const createChat = async (userId, adminId = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // If adminId is not provided, find an admin user
    let admin;
    if (adminId) {
      admin = await User.findById(adminId);
      if (!admin || admin.role !== "admin") {
        throw new ApiError(404, "Admin not found");
      }
    } else {
      admin = await User.findOne({ role: "admin" });
      if (!admin) {
        throw new ApiError(404, "No admin users found in system");
      }
    }

    // Check if a chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, admin._id] },
      isActive: true,
    });

    if (existingChat) {
      return existingChat;
    }

    // Create a new chat
    const newChat = await Chat.create({
      participants: [userId, admin._id],
      admin: admin._id,
      createdBy: userId,
    });

    // Populate the participants before returning
    await newChat.populate({
      path: "participants",
      select: "firstName lastName username avatar role",
    });

    return newChat;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error creating chat");
  }
};

/**
 * Deactivate a chat (soft delete)
 * @param {string} chatId - Chat ID to deactivate
 * @param {string} userId - User ID making the request
 * @returns {Promise<Object>} - The deactivated chat
 */
const deactivateChat = async (chatId, userId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      throw new ApiError(404, "Chat not found");
    }

    // Verify the user is an admin or the chat creator
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "admin" && chat.createdBy.toString() !== userId) {
      throw new ApiError(403, "You do not have permission to deactivate this chat");
    }

    // Soft delete the chat
    chat.isActive = false;
    await chat.save();

    return chat;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Error deactivating chat");
  }
};

export {
  getAllChats,
  getUserChats,
  getChatById,
  createChat,
  deactivateChat
};