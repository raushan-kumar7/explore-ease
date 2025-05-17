import { asyncHandler, ApiError } from "../utils/index.js";
import crypto from "crypto";

const verifyWebhook = asyncHandler(async (req, _, next) => {
  try {
    const signature = req.headers["x-webhook-signature"];

    if (!signature) {
      throw new ApiError(401, "Webhook signature missing");
    }

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new ApiError(500, "Webhook secret not configured");
    }

    // Get the raw request body
    const payload = JSON.stringify(req.body);

    // Calculate HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    // Compare signatures using timing-safe comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      throw new ApiError(401, "Invalid webhook signature");
    }

    next();
  } catch (error) {
    if (error instanceof crypto.Error) {
      throw new ApiError(401, "Invalid webhook signature format");
    }
    throw error;
  }
});

export { verifyWebhook };