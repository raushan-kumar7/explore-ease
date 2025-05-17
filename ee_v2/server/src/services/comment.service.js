import { Comment, Blog } from "../models/index.js";
import { ApiError } from "../utils/index.js";

/**
 * Create a new comment
 * @param {Object} commentData - Comment details
 * @returns {Promise<Object>} - Created comment object
 */
const createComment = async (commentData) => {
  try {
    // Check if blog exists
    const blog = await Blog.findById(commentData.blog);
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Create comment
    const comment = await Comment.create(commentData);
    return comment;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating comment"
    );
  }
};

/**
 * Get all comments for a blog
 * @param {string} blogId - Blog ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Object containing comments and pagination info
 */
const getBlogComments = async (blogId, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate({
        path: "user",
        select: "username avatar",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({ blog: blogId });

    return {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalItems: totalComments,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching comments"
    );
  }
};

/**
 * Get comment by ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} - Comment object
 */
const getCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId).populate({
      path: "user",
      select: "username avatar",
    });

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    return comment;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching comment"
    );
  }
};

/**
 * Update comment
 * @param {string} commentId - Comment ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Updated comment data
 * @returns {Promise<Object>} - Updated comment object
 */
const updateComment = async (commentId, userId, updateData) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // Verify user is the comment owner
    if (comment.user.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only update your own comments");
    }

    // Update comment
    Object.assign(comment, updateData);
    await comment.save();

    return comment;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating comment"
    );
  }
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deleted comment object
 */
const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // Verify user is the comment owner or admin check could be added here
    if (comment.user.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(commentId);

    return comment;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error deleting comment"
    );
  }
};

/**
 * Like a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} - Updated comment object
 */
const likeComment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    comment.likes += 1;
    await comment.save();

    return comment;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error liking comment"
    );
  }
};

export {
  createComment,
  getBlogComments,
  getCommentById,
  updateComment,
  deleteComment,
  likeComment,
};