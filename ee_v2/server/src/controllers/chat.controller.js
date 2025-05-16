import { ApiResponse, asyncHandler } from "../utils/index.js";
import { chat } from "../services/index.js";

const getAllChats = asyncHandler(async (req, res) => {
  const chats = await chat.getAllChats(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "All chats retrieved successfully"));
});

const getUserChats = asyncHandler(async (req, res) => {
  const chats = await chat.getUserChats(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "User chats retrieved successfully"));
});

const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const cht = await chat.getChatById(chatId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cht, "Chat retrieved successfully"));
});

const createChat = asyncHandler(async (req, res) => {
  const { adminId } = req.body;
  const cht = await chat.createChat(req.user._id, adminId);

  return res
    .status(201)
    .json(new ApiResponse(201, cht, "Chat created successfully"));
});

const deactivateChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  await chat.deactivateChat(chatId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deactivated successfully"));
});

export { getAllChats, getUserChats, getChatById, createChat, deactivateChat };