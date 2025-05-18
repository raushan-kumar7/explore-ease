import api from "@/utils/axios";

/**
 * User service for handling user profile operations
 */
const userService = {
  /**
   * Get user profile
   */
  getUserProfile: () => {
    return api.get("/u/profile");
  },
  
  /**
   * Update user profile information
   * @param {Object} userData - User data to update
   */
  updateUserProfile: (userData) => {
    return api.put("/u/profile", userData);
  },
  
  /**
   * Update user avatar
   * @param {FormData} formData - Form data with avatar image
   */
  updateUserAvatar: (formData) => {
    return api.patch("/u/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  /**
   * Delete user account
   */
  deleteUserAccount: () => {
    return api.delete("/u/delete-account");
  },
};

export default userService;