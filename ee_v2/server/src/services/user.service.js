import { User } from "../models/index.js";
import { ApiError } from "../utils/index.js";
import crypto from "crypto";
import { file } from "../services/index.js";

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user object
 */
const createUser = async (userData) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, `User with this email: ${email} already exists`);
  }

  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );
  
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating new user");
  }

  return createdUser;
};

/**
 * Find user by ID
 * @param {string} userId - User ID - email
 * @returns {Promise<Object>} User object
 */
const findUser = async (userId) => {
  const user = await User.findOne({email: userId}).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exists.");
  }

  return user;
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const findUserById = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exists.");
  }

  return user;
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object with password
 */
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exists.");
  }

  return user;
};

/**
 * Update user by ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
const updateUserById = async (userId, updateData) => {
  // Prevent password update through this function
  if (updateData.password) {
    throw new ApiError(400, "Password cannot be updated through this endpoint");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken -resetPasswordToken -resetPasswordExpires");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user details");
  }

  return updatedUser;
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Updated user object
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  return { success: true };
};

/**
 * Generate reset password token
 * @param {string} email - User email
 * @returns {Promise<string>} Reset token
 */
const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

/**
 * Reset password with token
 * @param {string} resetToken - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
const resetPassword = async (resetToken, newPassword) => {
  if (!resetToken || typeof resetToken !== 'string') {
    throw new ApiError(400, "Invalid reset token provided");
  }

  // Hash the token for comparison with stored hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  return true;
};

/**
 * Update user login attempts
 * @param {Object} user - User object
 * @param {boolean} reset - Whether to reset attempts
 * @returns {Promise<Object>} Updated user
 */
const updateLoginAttempts = async (user, reset = false) => {
  if (reset) {
    user.loginAttempts = 0;
    user.lockUntil = 0;
  } else {
    // If account lock expired, reset attempts
    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.loginAttempts = 1;
      user.lockUntil = 0;
    } else {
      user.loginAttempts += 1;

      // Lock account after 5 failed attempts for 1 hour
      if (user.loginAttempts >= 5 && !user.lockUntil) {
        user.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour lock
      }
    }
  }

  await user.save({ validateBeforeSave: false });
  return user;
};

/**
 * Generate auth tokens
 * @param {Object} user - User object
 * @returns {Promise<Object>} Access and refresh tokens
 */
const generateAuthTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Update user profile avatar
 * @param {string} userId - User ID
 * @param {string} localFilePath - Local path of uploaded file
 * @param {boolean} useCloudinary - Whether to use cloudinary or local storage
 * @returns {Promise<Object>} Updated user object
 */
const updateAvatar = async (userId, localFilePath, useCloudinary = true) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete existing avatar if it's not the default one
  if (user.avatar && !user.avatar.includes("user_oxe2tu.png")) {
    await file.deleteFile(user.avatar);
  }

  // Upload new avatar
  const avatarUrl = await file.uploadFile(localFilePath, "avatars", useCloudinary);

  // Update user record
  const updatedUser = await updateUserById(userId, { avatar: avatarUrl });
  
  return updatedUser;
};

export {
  createUser,
  findUser,
  findUserById,
  findUserByEmail,
  updateUserById,
  changePassword,
  generatePasswordResetToken,
  resetPassword,
  updateLoginAttempts,
  generateAuthTokens,
  updateAvatar
};