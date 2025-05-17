import { Payment, Booking } from "../models/index.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/index.js";

/**
 * Create a new payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Created payment
 */
const createPayment = async (paymentData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if booking exists
    const booking = await Booking.findById(paymentData.booking);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({
      booking: paymentData.booking,
    });
    if (existingPayment) {
      throw new ApiError(400, "Payment already exists for this booking");
    }

    // Create payment
    const payment = await Payment.create([paymentData], { session });

    // Update booking with payment reference
    booking.payment = payment[0]._id;
    await booking.save({ session });

    await session.commitTransaction();
    return payment[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get payment by ID
 * @param {string} id - Payment ID
 * @returns {Promise<Object>} Payment
 */
const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate({
    path: "booking",
    populate: [
      {
        path: "user",
        select: "firstName lastName email avatar username",
      },
      {
        path: "tour",
        select: "name description price images",
      },
    ],
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

/**
 * Get payment by transaction ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Payment
 */
const getPaymentByTransactionId = async (transactionId) => {
  const payment = await Payment.findOne({ transactionId }).populate({
    path: "booking",
    populate: [
      {
        path: "user",
        select: "firstName lastName email avatar username",
      },
      {
        path: "tour",
        select: "name description price images",
      },
    ],
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

/**
 * Get all payments with pagination and filters
 * @param {Object} filters - Filters for payments
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @returns {Promise<Object>} Payments with pagination info
 */
const getAllPayments = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = {};

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod;
  }

  if (filters.startDate) {
    query.paymentDate = { $gte: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    query.paymentDate = {
      ...query.paymentDate,
      $lte: new Date(filters.endDate),
    };
  }

  if (filters.booking) {
    query.booking = filters.booking;
  }

  const payments = await Payment.find(query)
    .populate({
      path: "booking",
      populate: {
        path: "user tour",
        select: "firstName lastName email username title description",
      },
    })
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(query);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update payment status
 * @param {string} id - Payment ID
 * @param {string} status - New payment status
 * @returns {Promise<Object>} Updated payment
 */
const updatePaymentStatus = async (id, status) => {
  const validStatuses = [
    "initiated",
    "processing",
    "completed",
    "failed",
    "refunded",
    "partially_refunded",
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const payment = await Payment.findById(id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  payment.status = status;
  await payment.save();

  return payment;
};

/**
 * Process refund for a payment
 * @param {string} id - Payment ID
 * @param {Object} refundData - Refund data
 * @returns {Promise<Object>} Updated payment with refund
 */
const processRefund = async (id, refundData) => {
  const payment = await Payment.findById(id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "completed") {
    throw new ApiError(400, "Cannot refund a payment that is not completed");
  }

  // Calculate current refund total
  const currentRefundTotal = payment.refunds.reduce((total, refund) => {
    if (refund.status === "completed") {
      return total + refund.amount;
    }
    return total;
  }, 0);

  // Check if refund amount is valid
  if (refundData.amount <= 0) {
    throw new ApiError(400, "Refund amount must be greater than 0");
  }

  if (currentRefundTotal + refundData.amount > payment.amount) {
    throw new ApiError(
      400,
      "Total refund amount cannot exceed the payment amount"
    );
  }

  // Create refund object
  const refund = {
    amount: refundData.amount,
    reason: refundData.reason || "Customer request",
    status: "initiated",
    refundDate: new Date(),
    refundId: `RF${Date.now().toString().substring(7)}${Math.floor(Math.random() * 1000)}`,
  };

  // Add refund to payment
  payment.refunds.push(refund);

  // Update payment status if needed
  if (currentRefundTotal + refundData.amount === payment.amount) {
    payment.status = "refunded";
  } else if (currentRefundTotal + refundData.amount < payment.amount) {
    payment.status = "partially_refunded";
  }

  await payment.save();

  return payment;
};

/**
 * Update refund status
 * @param {string} paymentId - Payment ID
 * @param {string} refundId - Refund ID
 * @param {string} status - New refund status
 * @returns {Promise<Object>} Updated payment
 */
const updateRefundStatus = async (paymentId, refundId, status) => {
  const validStatuses = ["initiated", "processing", "completed", "failed"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid refund status");
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const refund = payment.refunds.find((r) => r.refundId === refundId);

  if (!refund) {
    throw new ApiError(404, "Refund not found");
  }

  refund.status = status;
  await payment.save();

  return payment;
};

/**
 * Get payment statistics
 * @returns {Promise<Object>} Payment statistics
 */
const getPaymentStats = async () => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const methodStats = await Payment.aggregate([
    {
      $group: {
        _id: "$paymentMethod",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const monthlyStats = await Payment.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$paymentDate" },
          year: { $year: "$paymentDate" },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  return {
    statusStats: stats,
    methodStats,
    monthlyStats,
  };
};

export {
  createPayment,
  getPaymentById,
  getPaymentByTransactionId,
  getAllPayments,
  updatePaymentStatus,
  processRefund,
  updateRefundStatus,
  getPaymentStats,
};