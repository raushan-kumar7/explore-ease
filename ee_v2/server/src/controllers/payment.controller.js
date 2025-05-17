import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { paymentService } from "../services/index.js";
import { Booking } from "../models/index.js";

/**
 * Create a new payment
 * @route POST /api/payments
 * @access Private
 */
const createPayment = asyncHandler(async (req, res) => {
  const {
    booking,
    amount,
    currency,
    paymentMethod,
    upiDetails,
    cardDetails,
    referenceId,
    metadata,
  } = req.body;

  // Verify that the user owns the booking or is admin
  const bookingRecord = await Booking.findById(booking);
  if (!bookingRecord) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    req.user.role !== "admin" &&
    bookingRecord.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to make payment for this booking"
    );
  }

  const paymentData = {
    booking,
    amount,
    currency: currency || "INR",
    paymentMethod,
    status: "initiated",
    paymentDate: new Date(),
  };

  // Add optional fields if provided
  if (upiDetails) {
    paymentData.upiDetails = upiDetails;
  }

  if (cardDetails) {
    paymentData.cardDetails = cardDetails;
  }

  if (referenceId) {
    paymentData.referenceId = referenceId;
  }

  if (metadata) {
    paymentData.metadata = metadata;
  }

  const payment = await paymentService.createPayment(paymentData);

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment initiated successfully"));
});

/**
 * Get payment by ID
 * @route GET /api/payments/:id
 * @access Private
 */
const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await paymentService.getPaymentById(id);

  // Check if user owns the related booking or is admin
  const booking = await Booking.findById(payment.booking._id);

  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to view this payment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

/**
 * Get payment by transaction ID
 * @route GET /api/payments/transaction/:transactionId
 * @access Private
 */
const getPaymentByTransactionId = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  const payment = await paymentService.getPaymentByTransactionId(transactionId);

  // Check if user owns the related booking or is admin
  const booking = await Booking.findById(payment.booking._id);

  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to view this payment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

/**
 * Get all payments (admin only)
 * @route GET /api/payments
 * @access Admin
 */
const getAllPayments = asyncHandler(async (req, res) => {
  // Only admin can access all payments
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view all payments");
  }

  const {
    status,
    paymentMethod,
    startDate,
    endDate,
    booking,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {
    status,
    paymentMethod,
    startDate,
    endDate,
    booking,
  };

  const result = await paymentService.getAllPayments(filters, page, limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payments: result.payments, pagination: result.pagination },
        "Payments fetched successfully"
      )
    );
});

/**
 * Update payment status (webhook or admin)
 * @route PATCH /api/payments/:id/status
 * @access Admin/System
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // This could be called by a payment gateway webhook
  // If coming from a user, ensure they are admin
  if (req.user && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update payment status");
  }

  const payment = await paymentService.updatePaymentStatus(id, status);

  return res
    .status(200)
    .json(new ApiResponse(200, payment, `Payment status updated to ${status}`));
});

/**
 * Process refund (admin only)
 * @route POST /api/payments/:id/refund
 * @access Admin
 */
const processRefund = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to process refunds");
  }

  if (!amount) {
    throw new ApiError(400, "Refund amount is required");
  }

  const payment = await paymentService.processRefund(id, { amount, reason });

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Refund processed successfully"));
});

/**
 * Update refund status (webhook or admin)
 * @route PATCH /api/payments/:paymentId/refund/:refundId
 * @access Admin/System
 */
const updateRefundStatus = asyncHandler(async (req, res) => {
  const { paymentId, refundId } = req.params;
  const { status } = req.body;

  // This could be called by a payment gateway webhook
  // If coming from a user, ensure they are admin
  if (req.user && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update refund status");
  }

  const payment = await paymentService.updateRefundStatus(
    paymentId,
    refundId,
    status
  );

  return res
    .status(200)
    .json(new ApiResponse(200, payment, `Refund status updated to ${status}`));
});

/**
 * Get payment statistics (admin only)
 * @route GET /api/payments/stats
 * @access Admin
 */
const getPaymentStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "You are not authorized to access payment statistics"
    );
  }

  const stats = await paymentService.getPaymentStats();

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Payment statistics fetched successfully")
    );
});

/**
 * Payment webhook handler
 * @route POST /api/payments/webhook
 * @access Public (secured by webhook secret)
 */
const handlePaymentWebhook = asyncHandler(async (req, res) => {
  // Note: Webhook verification would typically be implemented in middleware
  const { event, data } = req.body;

  switch (event) {
    case "payment_successful":
      if (data.transactionId) {
        const payment = await paymentService.getPaymentByTransactionId(
          data.transactionId
        );
        await paymentService.updatePaymentStatus(payment._id, "completed");
      }
      break;

    case "payment_failed":
      if (data.transactionId) {
        const payment = await paymentService.getPaymentByTransactionId(
          data.transactionId
        );
        await paymentService.updatePaymentStatus(payment._id, "failed");
      }
      break;

    case "refund_successful":
      if (data.transactionId && data.refundId) {
        const payment = await paymentService.getPaymentByTransactionId(
          data.transactionId
        );
        const refund = payment.refunds.find(
          (r) => r.refundId === data.refundId
        );
        if (refund) {
          await paymentService.updateRefundStatus(
            payment._id,
            data.refundId,
            "completed"
          );
        }
      }
      break;

    default:
      // Log unhandled webhook events
      console.log(`Unhandled webhook event: ${event}`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { received: true }, "Webhook processed successfully")
    );
});

export {
  createPayment,
  getPaymentById,
  getPaymentByTransactionId,
  getAllPayments,
  updatePaymentStatus,
  processRefund,
  updateRefundStatus,
  getPaymentStats,
  handlePaymentWebhook,
};