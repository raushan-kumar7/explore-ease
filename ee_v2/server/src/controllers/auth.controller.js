import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { User } from "../models/index.js";
import { usr } from "../services/index.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role = "user" } = req.body;

  if (!(firstName && lastName && email && phone && password)) {
    throw new ApiError(400, "All fields are required");
  }

  const newUser = await usr.createUser({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "New user account created successfully."));
});

const signin = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    throw new ApiError(400, "User ID and password are required");
  }

  // Find user with password field included
  const user = await User.findOne({
    $or: [{ email: userId }, { username: userId }]
  });

  if (!user) {
    throw new ApiError(401, `User does not exist with this ${userId}`);
  }

  // check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
    throw new ApiError(
      403,
      `Account locked due to multiple failed attempts. Try again in ${remainingTime} minutes`
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    await usr.updateLoginAttempts(user);
    // Check if this attempt caused a lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new ApiError(
        403,
        "Account locked due to multiple failed attempts. Try again in 60 minutes"
      );
    }

    throw new ApiError(401, "Invalid credentials");
  }

  // Reset the login attempts on successful signin
  await usr.updateLoginAttempts(user, true);

  const { accessToken, refreshToken } = await usr.generateAuthTokens(user);

  const loggedInUser = await usr.findUserById(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const signout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request", "AUTH_TOKEN_MISSING");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Refresh token has expired", "AUTH_TOKEN_EXPIRED");
      }
      throw new ApiError(401, "Invalid refresh token", "AUTH_TOKEN_INVALID");
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token", "AUTH_TOKEN_INVALID");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      // Clear existing cookies when token is used or expired
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      throw new ApiError(401, "Refresh token is expired or used", "AUTH_TOKEN_EXPIRED");
    }

    const { accessToken, refreshToken } = await usr.generateAuthTokens(user);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    // Pass through ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    // For any other errors
    throw new ApiError(401, error?.message || "Invalid refresh token", "AUTH_TOKEN_EXPIRED");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, frontendResetUrl } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const resetToken = await usr.generatePasswordResetToken(email);
  
  // Generate reset URL if frontend URL is provided
  let resetUrl;
  if (frontendResetUrl) {
    resetUrl = `${frontendResetUrl}?token=${resetToken}`;
  } else {
    // Generate a backend reset URL if frontend URL is not provided
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    resetUrl = `${baseUrl}/api/v1/auth/reset-password?token=${resetToken}`;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetToken, resetUrl },
        "Password reset link has been sent to your email."
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  // Get token from either request body or query parameter
  const resetToken = req.body.resetToken || req.query.token;
  const { newPassword } = req.body;

  if (!resetToken) {
    throw new ApiError(400, "Reset token is required");
  }

  if (!newPassword) {
    throw new ApiError(400, "New password is required");
  }

  await usr.resetPassword(resetToken, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  await usr.changePassword(user._id, oldPassword, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export {
  signup,
  signin,
  signout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  currentUser,
};