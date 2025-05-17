import { Booking, Tour, User, Payment } from "../models/index.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/index.js";

// /**
//  * Create a new booking
//  * @param {Object} bookingData - Booking data
//  * @returns {Promise<Object>} Created booking
//  */
// const createBooking = async (bookingData) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Check if tour exists and has availability
//     const tour = await Tour.findById(bookingData.tour);
//     if (!tour) {
//       throw new ApiError(404, "Tour not found");
//     }

//     // Check if user exists
//     const user = await User.findById(bookingData.user);
//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }

//     // Create booking
//     const booking = await Booking.create([bookingData], { session });

//     await session.commitTransaction();
//     return booking[0];
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Created booking
 */
const createBooking = async (bookingData) => {
  try {
    // Check if tour exists and has availability
    const tour = await Tour.findById(bookingData.tour);
    if (!tour) {
      throw new ApiError(404, "Tour not found");
    }

    // Check if user exists
    const user = await User.findById(bookingData.user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Create booking - try with transaction first, fall back to regular creation
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      
      const booking = await Booking.create([bookingData], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      return booking[0];
    } catch (txnError) {
      // If error is related to transactions not being supported
      if (txnError.message && txnError.message.includes('Transaction')) {
        // Fall back to regular creation without transaction
        const booking = await Booking.create(bookingData);
        return booking;
      }
      // For other errors, rethrow
      throw txnError;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking
 */
const getBookingById = async (id) => {
  const booking = await Booking.findById(id)
    .populate("user", "firstName lastName email avatar username")
    .populate("tour", "name description price duration location images")
    .populate("payment");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

/**
 * Get booking by reference number
 * @param {string} reference - Booking reference number
 * @returns {Promise<Object>} Booking
 */
const getBookingByReference = async (reference) => {
  const booking = await Booking.findOne({ bookingReference: reference })
    .populate("user", "firstName lastName email avatar username")
    .populate("tour", "name description price duration location images")
    .populate("payment");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

/**
 * Get all bookings with pagination and filters
 * @param {Object} filters - Filters for bookings
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @returns {Promise<Object>} Bookings with pagination info
 */
const getAllBookings = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = {};

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate) {
    query.startDate = { $gte: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    query.endDate = { $lte: new Date(filters.endDate) };
  }

  if (filters.user) {
    query.user = filters.user;
  }

  if (filters.tour) {
    query.tour = filters.tour;
  }

  const bookings = await Booking.find(query)
    .populate("user", "firstName lastName email avatar username")
    .populate("tour", "name description price images")
    .populate("payment")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  return {
    bookings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all bookings for a specific user
 * @param {string} userId - User ID
 * @param {Object} filters - Filters for bookings
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @returns {Promise<Object>} User's bookings with pagination info
 */
const getUserBookings = async (userId, filters = {}, page = 1, limit = 10) => {
  filters.user = userId;
  return getAllBookings(filters, page, limit);
};

/**
 * Update booking status
 * @param {string} id - Booking ID
 * @param {string} status - New booking status
 * @returns {Promise<Object>} Updated booking
 */
const updateBookingStatus = async (id, status) => {
  const validStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid booking status");
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  booking.status = status;
  await booking.save();

  return booking;
};

/**
 * Update booking details
 * @param {string} id - Booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated booking
 */
const updateBooking = async (id, updateData) => {
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Prevent updating sensitive fields directly
  const allowedFields = [
    "numberOfPeople",
    "specialRequests",
    "contactInformation",
    "participants",
  ];

  Object.keys(updateData).forEach((key) => {
    if (!allowedFields.includes(key)) {
      delete updateData[key];
    }
  });

  Object.assign(booking, updateData);
  await booking.save();

  return booking;
};

/**
 * Delete a booking
 * @param {string} id - Booking ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteBooking = async (id) => {
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status === "confirmed" || booking.status === "completed") {
    throw new ApiError(400, "Cannot delete confirmed or completed bookings");
  }

  // Check if there's an associated payment
  if (booking.payment) {
    const payment = await Payment.findById(booking.payment);
    if (payment && payment.status === "completed") {
      throw new ApiError(400, "Cannot delete a booking with completed payment");
    }
  }

  await Booking.findByIdAndDelete(id);
  return true;
};

/**
 * Get booking statistics
 * @returns {Promise<Object>} Booking statistics
 */
const getBookingStats = async () => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const monthlyStats = await Booking.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  return {
    statusStats: stats,
    monthlyStats,
  };
};

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