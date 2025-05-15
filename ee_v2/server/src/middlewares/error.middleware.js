import { ApiError, ApiResponse } from "../utils/index.js";

/**
 * Formats and logs errors based on environment
 * @param {Error} err - The error object to log
 */
const logError = (err) => {
  // In production, log a cleaner format
  if (process.env.NODE_ENV === "production") {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
    // Optionally log to a service like Sentry, Datadog, etc.
  } else {
    // In development, log the full stack trace
    console.error(`[ERROR] ${err.stack}`);
  }
};

const errorMiddleware = (err, req, res, next) => {
  // Log the error with proper formatting
  logError(err);

  // Get status code from error object or default to 500
  const statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === "ValidationError") {
    const validationError = new ApiError(400, "Validation error");
    validationError.details = err.details || err.errors;
    return res.status(400).json(validationError);
  }

  if (err.name === "UnauthorizedError") {
    const authError = new ApiError(401, "Authentication error");
    return res.status(401).json(authError);
  }

  if (err.message && err.message.includes("token") && 
     (err.message.includes("expired") || err.message.includes("used"))) {
    const tokenError = new ApiError(401, "Your session has expired. Please log in again.");
    tokenError.code = "AUTH_TOKEN_EXPIRED";
    return res.status(401).json(tokenError);
  }

  if (process.env.NODE_ENV === "production" && statusCode === 500 && !err.isOperational) {
    const sanitizedError = new ApiError(500, "Something went wrong on our end. Please try again later.");
    return res.status(500).json(sanitizedError);
  }

  const errorResponse = err instanceof ApiError 
    ? err 
    : new ApiError(
        statusCode,
        err.message || "Internal server error"
      );

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      false,
      errorResponse.message,
      process.env.NODE_ENV === "development" ? { error: err, stack: err.stack } : null
    )
  );
};

const notFoundMiddleware = (req, res) => {
  const notFoundError = new ApiError(404, `Resource not found: ${req.originalUrl}`);
  notFoundError.code = "RESOURCE_NOT_FOUND";
  return res.status(404).json(notFoundError);
};

export { errorMiddleware, notFoundMiddleware };