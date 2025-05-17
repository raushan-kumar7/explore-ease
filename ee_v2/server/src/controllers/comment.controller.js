import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { commentService } from "../services/index.js";

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 * @access  Private
 */
const createComment = asyncHandler(async (req, res) => {
  const commentData = req.body;

  // Add user ID from authenticated user
  if (req.user) {
    commentData.user = req.user._id;
  } else {
    throw new ApiError(401, "Authentication required to comment");
  }

  const comment = await commentService.createComment(commentData);

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

/**
 * @desc    Get all comments for a blog
 * @route   GET /api/comments/blog/:blogId
 * @access  Public
 */
const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  const result = await commentService.getBlogComments(blogId, options);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
});

/**
 * @desc    Get comment by ID
 * @route   GET /api/comments/:commentId
 * @access  Public
 */
const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await commentService.getCommentById(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment fetched successfully"));
});

/**
 * @desc    Update comment
 * @route   PUT /api/comments/:commentId
 * @access  Private
 */
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const updateData = req.body;

  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const updatedComment = await commentService.updateComment(
    commentId,
    req.user._id,
    updateData
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:commentId
 * @access  Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  await commentService.deleteComment(commentId, req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

/**
 * @desc    Like a comment
 * @route   POST /api/comments/:commentId/like
 * @access  Private
 */
const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // In a real app, you would track which users have liked which comments
  // to prevent multiple likes from the same user
  // For simplicity, we're just incrementing the like count

  const updatedComment = await commentService.likeComment(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment liked successfully"));
});

export {
  createComment,
  getBlogComments,
  getCommentById,
  updateComment,
  deleteComment,
  likeComment,
};