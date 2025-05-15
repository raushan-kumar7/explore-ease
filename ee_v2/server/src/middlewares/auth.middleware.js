import { ApiError, asyncHandler } from "../utils/index.js";
import { usr } from "../services/index.js";
import jwt from "jsonwebtoken";

export const authenticate = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["Authorization"]?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await usr.findUserById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const authorizeRole = (...roles) => {
  return asyncHandler(async (req, _, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied. Unauthorized access");
    }
    next();
  });
};