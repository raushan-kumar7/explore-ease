import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { health } from "../services/index.js";

const checkHealthController = asyncHandler(async (req, res) => {
  const healthStatus = await health.checkHealth();

  if (!healthStatus) {
    throw new ApiError(500, "Health check failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, healthStatus, "Server health checked successfully")
    );
});

export { checkHealthController };