import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { User } from "../models/index.js";
import { usr, file } from "../services/index.js";

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await usr.findUserById(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userData = req.body;
  
  if (Object.keys(userData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }
  
  const updateData = { ...userData };
  
  const updatedUser = await usr.updateUserById(req.user._id, updateData);
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User profile updated successfully"));
});

const updateUserProfileAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar image is required");
  }
  
  // Parse the useCloudinary parameter properly
  const useCloudinary = process.env.USE_CLOUDINARY === "true" || req.query.useCloudinary === "true";
  
  // Update user avatar
  const updatedUser = await usr.updateAvatar(req.user._id, req.file.path, useCloudinary);
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password -refreshToken")
    .skip(skip)
    .limit(limit);

  const totalUser = await User.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page,
          limit,
          totalUser,
          totalPages: Math.ceil(totalUser / limit),
        },
      },
      "Users found successfully"
    )
  );
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await usr.findUserById(req.user._id);
  
  // Delete user avatar if it's not the default avatar
  if (user.avatar && !user.avatar.includes("user_oxe2tu.png")) {
    await file.deleteFile(user.avatar);
  }
  
  const deletedUser = await User.findByIdAndDelete(req.user._id);

  if (!deletedUser) {
    throw new ApiError(500, "Something went wrong while deleting your account");
  }

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

export {
  getUserProfile,
  updateUserProfile,
  updateUserProfileAvatar,
  getAllUsers,
  deleteUserProfile
};