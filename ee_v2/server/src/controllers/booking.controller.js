import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { bookingService } from "../services/index.js";

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const {
    tour,
    startDate,
    endDate,
    totalPrice,
    numberOfPeople,
    specialRequests,
    contactInformation,
    participants,
  } = req.body;

  // User is coming from auth middleware
  const userId = req.user._id;

  const bookingData = {
    user: userId,
    tour,
    startDate,
    endDate,
    totalPrice,
    numberOfPeople,
    specialRequests,
    contactInformation,
    participants,
    status: "pending",
  };

  const booking = await bookingService.createBooking(bookingData);

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

/**
 * Get booking by ID
 * @route GET /api/bookings/:id
 * @access Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await bookingService.getBookingById(id);

  // Check if user owns the booking or is admin
  if (
    req.user.role !== "admin" &&
    booking.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to view this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking data retrieved successfully"));
});

/**
 * Get booking by reference
 * @route GET /api/bookings/reference/:reference
 * @access Private
 */
const getBookingByReference = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  const booking = await bookingService.getBookingByReference(reference);

  // Check if user owns the booking or is admin
  if (
    req.user.role !== "admin" &&
    booking.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to view this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking data retrieved successfully"));
});

/**
 * Get all bookings (admin only)
 * @route GET /api/bookings
 * @access Admin
 */
const getAllBookings = asyncHandler(async (req, res) => {
  // Only admin can access all bookings
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view all bookings");
  }

  const {
    status,
    startDate,
    endDate,
    user,
    tour,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {
    status,
    startDate,
    endDate,
    user,
    tour,
  };

  const result = await bookingService.getAllBookings(filters, page, limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings: result.bookings,
        pagination: result.pagination,
      },
      "All booking data retrieved successfully"
    )
  );
});

/**
 * Get current user's bookings
 * @route GET /api/bookings/my-bookings
 * @access Private
 */
const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, startDate, endDate, tour, page = 1, limit = 10 } = req.query;

  const filters = {
    status,
    startDate,
    endDate,
    tour,
  };

  const result = await bookingService.getUserBookings(
    userId,
    filters,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings: result.bookings,
        pagination: result.pagination,
      },
      "User booking data retrieved successfully"
    )
  );
});

/**
 * Update booking status
 * @route PATCH /api/bookings/:id/status
 * @access Admin
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update booking status");
  }

  const booking = await bookingService.updateBookingStatus(id, status);

  return res
    .status(200)
    .json(new ApiResponse(200, booking, `Booking status updated to ${status}`));
});

/**
 * Update booking details
 * @route PATCH /api/bookings/:id
 * @access Private
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Get current booking to check ownership
  const currentBooking = await bookingService.getBookingById(id);

  // Check if user owns the booking or is admin
  if (
    req.user.role !== "admin" &&
    currentBooking.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to update this booking");
  }

  // Check if booking is already confirmed or completed
  if (
    currentBooking.status === "confirmed" ||
    currentBooking.status === "completed"
  ) {
    throw new ApiError(400, "Cannot update confirmed or completed bookings");
  }

  const booking = await bookingService.updateBooking(id, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking updated successfully"));
});

/**
 * Delete a booking
 * @route DELETE /api/bookings/:id
 * @access Private
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get current booking to check ownership
  const currentBooking = await bookingService.getBookingById(id);

  // Check if user owns the booking or is admin
  if (
    req.user.role !== "admin" &&
    currentBooking.user._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to delete this booking");
  }

  await bookingService.deleteBooking(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Booking deleted successfully"));
});

/**
 * Get booking statistics (admin only)
 * @route GET /api/bookings/stats
 * @access Admin
 */
const getBookingStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "You are not authorized to access booking statistics"
    );
  }

  const stats = await bookingService.getBookingStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats,
        "All booking stats data retrieved successfully"
      )
    );
});

export {
  createBooking,
  getBookingById,
  getBookingByReference,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getBookingStats,
};