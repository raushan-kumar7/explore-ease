// import { ApiResponse, asyncHandler } from "../utils/index.js";
// import { message } from "../services/index.js";

// const getMessages = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;
//   const { page, limit } = req.query;

//   const msgs = await message.getMessages(chatId, req.user._id, { page, limit });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, msgs, "Messages retrieved successfully"));
// });

// const sendMessage = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;
//   const { content } = req.body;

//   const attachments = req.files ? req.files.map((file) => file.path) : [];

//   const msg = await message.sendMessage(
//     chatId,
//     req.user._id,
//     content,
//     attachments
//   );

//   return res
//     .status(201)
//     .json(new ApiResponse(201, msg, "Message sent successfully"));
// });

// const deleteMessage = asyncHandler(async (req, res) => {
//   const { messageId } = req.params;

//   await message.deleteMessage(messageId, req.user._id);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Message deleted successfully"));
// });

// const markChatAsRead = asyncHandler(async (req, res) => {
//   const { chatId } = req.params;

//   const result = await message.markChatAsRead(chatId, req.user._id);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, result, "Message marked as read"));
// });

// const getUnreadMessageCount = asyncHandler(async (req, res) => {
//   const unreadCounts = await message.getUnreadMessageCount(req.user._id);

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, unreadCounts, "Unread message counts retrieved")
//     );
// });

// export {
//   getMessages,
//   sendMessage,
//   deleteMessage,
//   markChatAsRead,
//   getUnreadMessageCount,
// };

import { ApiResponse, asyncHandler } from "../utils/index.js";
import { message } from "../services/index.js";

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page, limit } = req.query;

  const msgs = await message.getMessages(chatId, req.user._id, { page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, msgs, "Messages retrieved successfully"));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  // Handle both single file or multiple files correctly
  let attachments = [];
  if (req.file) {
    // Single file upload
    attachments.push(req.file.path);
  } else if (req.files && req.files.length > 0) {
    // Multiple files upload
    attachments = req.files.map(file => file.path);
  }

  const msg = await message.sendMessage(
    chatId,
    req.user._id,
    content,
    attachments
  );

  return res
    .status(201)
    .json(new ApiResponse(201, msg, "Message sent successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  await message.deleteMessage(messageId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted successfully"));
});

const markChatAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const result = await message.markChatAsRead(chatId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Message marked as read"));
});

const getUnreadMessageCount = asyncHandler(async (req, res) => {
  const unreadCounts = await message.getUnreadMessageCount(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, unreadCounts, "Unread message counts retrieved")
    );
});

export {
  getMessages,
  sendMessage,
  deleteMessage,
  markChatAsRead,
  getUnreadMessageCount,
};