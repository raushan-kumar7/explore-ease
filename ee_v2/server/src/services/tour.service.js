import { Tour } from "../models/index.js";
import { ApiError } from "../utils/index.js";
import { deleteMultipleFromCloudinary } from "./cloudinary.service.js";

/**
 * Create a new tour
 * @param {Object} tourData - Tour details
 * @returns {Promise<Object>} - Created tour object
 */
const createTour = async (tourData) => {
  try {
    const tour = await Tour.create(tourData);
    return tour;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating tour"
    );
  }
};

/**
 * Get all tours with optional filtering
 * @param {Object} filter - Filter options
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Array of tours
 */
const getAllTours = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  try {
    const tours = await Tour.find(filter).sort(sort).skip(skip).limit(limit);

    const totalTours = await Tour.countDocuments(filter);

    return {
      tours,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTours / limit),
        totalItems: totalTours,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching tours"
    );
  }
};

/**
 * Get featured tours
 * @param {number} limit - Number of tours to return
 * @returns {Promise<Array>} - Array of featured tours
 */
const getFeaturedTours = async (limit = 8) => {
  try {
    const featuredTours = await Tour.find({ featured: true })
      .sort("-createdAt")
      .limit(limit);
    return featuredTours;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching featured tours"
    );
  }
};

/**
 * Get tour by ID
 * @param {string} tourId - Tour ID
 * @returns {Promise<Object>} - Tour object
 */
const getTourById = async (tourId) => {
  try {
    const tour = await Tour.findById(tourId).populate({
      path: "reviews",
      select: "reviewText rating username",
    });

    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    return tour;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching tour"
    );
  }
};

/**
 * Update tour details
 * @param {string} tourId - Tour ID
 * @param {Object} updateData - Updated tour data
 * @returns {Promise<Object>} - Updated tour object
 */
const updateTour = async (tourId, updateData) => {
  try {
    const tour = await Tour.findByIdAndUpdate(tourId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    return tour;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating tour"
    );
  }
};

/**
 * Delete a tour
 * @param {string} tourId - Tour ID
 * @returns {Promise<Object>} - Deleted tour object
 */
const deleteTour = async (tourId) => {
  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    // Delete tour images from Cloudinary
    if (tour.images && tour.images.length > 0) {
      await deleteMultipleFromCloudinary(tour.images);
    }

    // Delete the tour
    await Tour.findByIdAndDelete(tourId);

    return tour;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error deleting tour"
    );
  }
};

/**
 * Update tour images
 * @param {string} tourId - Tour ID
 * @param {Array} newImages - Array of new image URLs
 * @returns {Promise<Object>} - Updated tour object
 */
const updateTourImages = async (tourId, newImages) => {
  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    tour.images = newImages;
    await tour.save();

    return tour;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating tour images"
    );
  }
};

/**
 * Search tours by title, description, or location
 * @param {string} query - Search query
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} - Array of matching tours
 */
const searchTours = async (query, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  try {
    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "location.country": { $regex: query, $options: "i" } },
        { "location.state": { $regex: query, $options: "i" } },
        { "location.city": { $regex: query, $options: "i" } },
      ],
    };

    const tours = await Tour.find(searchFilter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const totalTours = await Tour.countDocuments(searchFilter);

    return {
      tours,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTours / limit),
        totalItems: totalTours,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error searching tours"
    );
  }
};

export {
  createTour,
  getAllTours,
  getFeaturedTours,
  getTourById,
  updateTour,
  deleteTour,
  updateTourImages,
  searchTours,
};