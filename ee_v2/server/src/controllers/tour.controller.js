import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { tourService } from "../services/index.js";

/**
 * @desc    Create a new tour
 * @route   POST /api/tours
 * @access  Private (Admin)
 */
const createTour = asyncHandler(async (req, res) => {
  const tourData = req.body;

  // Add tour geometry based on location if not provided
  if (!tourData.geometry && tourData.location) {
    // In a real app, you would use a geocoding service here
    // This is just a placeholder implementation
    tourData.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(tourData.location.longitude) || 0,
        parseFloat(tourData.location.latitude) || 0,
      ],
    };
  }

  // Add tour images from uploaded files if available
  if (req.files && req.files.length > 0) {
    tourData.images = req.files.map((file) => file.path);
  }

  const tour = await tourService.createTour(tourData);

  res
    .status(201)
    .json(new ApiResponse(201, tour, "Tour created successfully"));
});

/**
 * @desc    Get all tours
 * @route   GET /api/tours
 * @access  Public
 */
const getAllTours = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "-createdAt", featured } = req.query;
  
  let filter = {};
  if (featured === "true") {
    filter.featured = true;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  const result = await tourService.getAllTours(filter, options);

  res.status(200).json(
    new ApiResponse(200, result, "Tours fetched successfully")
  );
});

/**
 * @desc    Get featured tours
 * @route   GET /api/tours/featured
 * @access  Public
 */
const getFeaturedTours = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;
  
  const featuredTours = await tourService.getFeaturedTours(parseInt(limit, 10));

  res.status(200).json(
    new ApiResponse(200, featuredTours, "Featured tours fetched successfully")
  );
});

/**
 * @desc    Get tour by ID
 * @route   GET /api/tours/:tourId
 * @access  Public
 */
const getTourById = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  
  const tour = await tourService.getTourById(tourId);

  res.status(200).json(
    new ApiResponse(200, tour, "Tour fetched successfully")
  );
});

/**
 * @desc    Update tour
 * @route   PUT /api/tours/:tourId
 * @access  Private (Admin)
 */
const updateTour = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  const updateData = req.body;

  // Update geometry if location is updated
  if (updateData.location && !updateData.geometry) {
    updateData.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(updateData.location.longitude) || 0,
        parseFloat(updateData.location.latitude) || 0,
      ],
    };
  }

  const updatedTour = await tourService.updateTour(tourId, updateData);

  res.status(200).json(
    new ApiResponse(200, updatedTour, "Tour updated successfully")
  );
});

/**
 * @desc    Delete tour
 * @route   DELETE /api/tours/:tourId
 * @access  Private (Admin)
 */
const deleteTour = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  
  await tourService.deleteTour(tourId);

  res.status(200).json(
    new ApiResponse(200, null, "Tour deleted successfully")
  );
});

/**
 * @desc    Update tour images
 * @route   PUT /api/tours/:tourId/images
 * @access  Private (Admin)
 */
const updateTourImages = asyncHandler(async (req, res) => {
  const { tourId } = req.params;
  
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No image files provided");
  }

  const newImages = req.files.map((file) => file.path);
  
  const updatedTour = await tourService.updateTourImages(tourId, newImages);

  res.status(200).json(
    new ApiResponse(200, updatedTour, "Tour images updated successfully")
  );
});

/**
 * @desc    Search tours
 * @route   GET /api/tours/search
 * @access  Public
 */
const searchTours = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  
  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await tourService.searchTours(q, options);

  res.status(200).json(
    new ApiResponse(200, result, "Search results fetched successfully")
  );
});

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