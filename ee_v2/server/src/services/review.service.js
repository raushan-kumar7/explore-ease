import { Review, Tour } from "../models/index.js";
import { ApiError } from "../utils/index.js";

/**
 * Create a new review
 * @param {Object} reviewData - Review details
 * @returns {Promise<Object>} - Created review object
 */
const createReview = async (reviewData) => {
  try {
    // Check if tour exists
    const tour = await Tour.findById(reviewData.productId);
    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    // Create review
    const review = await Review.create(reviewData);

    // Add review to tour's reviews array
    tour.reviews.push(review._id);

    // Update tour rating
    const allReviews = await Review.find({ productId: reviewData.productId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    tour.rating = totalRating / allReviews.length;

    await tour.save();

    return review;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating review"
    );
  }
};

/**
 * Get all reviews for a tour
 * @param {string} tourId - Tour ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Object containing reviews and pagination info
 */
const getTourReviews = async (tourId, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  try {
    const reviews = await Review.find({ productId: tourId })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ productId: tourId });

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalItems: totalReviews,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching reviews"
    );
  }
};

/**
 * Get review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} - Review object
 */
const getReviewById = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    return review;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching review"
    );
  }
};

/**
 * Update review
 * @param {string} reviewId - Review ID
 * @param {Object} updateData - Updated review data
 * @returns {Promise<Object>} - Updated review object
 */
const updateReview = async (reviewId, updateData) => {
  try {
    const review = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // If rating was updated, recalculate tour's average rating
    if (updateData.rating !== undefined) {
      const tour = await Tour.findById(review.productId);
      if (tour) {
        const allReviews = await Review.find({ productId: review.productId });
        const totalRating = allReviews.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        tour.rating = totalRating / allReviews.length;
        await tour.save();
      }
    }

    return review;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating review"
    );
  }
};

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} - Deleted review object
 */
const deleteReview = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    // Remove review from tour's reviews array
    const tour = await Tour.findById(review.productId);
    if (tour) {
      tour.reviews = tour.reviews.filter(
        (id) => id.toString() !== reviewId.toString()
      );

      // Recalculate tour's average rating
      const allReviews = await Review.find({
        productId: review.productId,
        _id: { $ne: reviewId },
      });

      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        tour.rating = totalRating / allReviews.length;
      } else {
        tour.rating = 0;
      }

      await tour.save();
    }

    await Review.findByIdAndDelete(reviewId);

    return review;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error deleting review"
    );
  }
};

export {
  createReview,
  getTourReviews,
  getReviewById,
  updateReview,
  deleteReview,
};