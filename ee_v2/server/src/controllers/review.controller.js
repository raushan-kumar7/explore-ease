import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { reviewService } from "../services/index.js";

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const reviewData = req.body;

  // Add username from authenticated user if not provided
  if (!reviewData.username && req.user) {
    reviewData.username = req.user.username;
  }

  const review = await reviewService.createReview(reviewData);

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

/**
 * @desc    Get all reviews for a tour
 * @route   GET /api/reviews/tour/:tourId
 * @access  Public
 */
const getTourReviews = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  const result = await reviewService.getTourReviews(tourId, options);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Reviews fetched successfully"));
});

/**
 * @desc    Get review by ID
 * @route   GET /api/reviews/:reviewId
 * @access  Public
 */
const getReviewById = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await reviewService.getReviewById(reviewId);

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:reviewId
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const updateData = req.body;

  // Verify user is the review owner (in a real app)
  // This would involve checking if the review belongs to the authenticated user
  // For now, we're just passing through the update request

  const updatedReview = await reviewService.updateReview(reviewId, updateData);

  res
    .status(200)
    .json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  // Verify user is the review owner (in a real app)
  // For now, we're just passing through the delete request

  await reviewService.deleteReview(reviewId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

export {
  createReview,
  getTourReviews,
  getReviewById,
  updateReview,
  deleteReview,
};