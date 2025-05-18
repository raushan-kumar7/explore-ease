import api from "@/utils/axios";

/**
 * Authentication service for handling user auth operations
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  signup: (userData) => {
    return api.post("/auth/signup", userData);
  },

  /**
   * Login a user
   * @param {Object} credentials - Login credentials (userId, password)
   */
  signin: (credentials) => {
    return api.post("/auth/signin", credentials);
  },

  /**
   * Logout the current user
   */
  signout: () => {
    return api.post("/auth/signout");
  },

  /**
   * Get current user profile
   */
  getCurrentUser: () => {
    return api.get("/auth/me");
  },

  /**
   * Request password reset
   * @param {string} email - User's email
   * @param {string} frontendResetUrl - Frontend URL for reset page
   */
  forgotPassword: (email, frontendResetUrl) => {
    return api.post("/auth/forgot-password", { email, frontendResetUrl });
  },

  /**
   * Reset password with token
   * @param {string} resetToken - Password reset token
   * @param {string} newPassword - New password
   */
  resetPassword: (resetToken, newPassword) => {
    return api.patch("/auth/reset-password", { resetToken, newPassword });
  },

  /**
   * Change password when logged in
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   */
  changePassword: (oldPassword, newPassword) => {
    return api.patch("/auth/change-password", { oldPassword, newPassword });
  },
};

export default authService;