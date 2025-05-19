import api from "@/utils/axios";

/**
 * Tour service for handling tour operations
 */
const tourService = {
  /**
   * Get all tours
   * @param {Object} params - Query parameters for filtering tours
   */
  getAllTours: (params = {}) => {
    return api.get("/tours", { params });
  },

  /**
   * Get featured tours
   */
  getFeaturedTours: () => {
    return api.get("/tours/featured");
  },

  /**
   * Search tours
   * @param {Object} searchParams - Search parameters
   */
  searchTours: (searchParams) => {
    return api.get("/tours/search", { params: searchParams });
  },

  /**
   * Get tour by ID
   * @param {string} tourId - Tour ID
   */
  getTourById: (tourId) => {
    return api.get(`/tours/${tourId}`);
  },

  /**
   * Create a new tour (admin only)
   * @param {FormData} formData - Tour data with images
   */
  createTour: (formData) => {
    return api.post("/tours", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update tour (admin only)
   * @param {string} tourId - Tour ID
   * @param {Object} tourData - Tour data to update
   */
  updateTour: (tourId, tourData) => {
    return api.put(`/tours/${tourId}`, tourData);
  },

  /**
   * Delete tour (admin only)
   * @param {string} tourId - Tour ID
   */
  deleteTour: (tourId) => {
    return api.delete(`/tours/${tourId}`);
  },

  /**
   * Update tour images (admin only)
   * @param {string} tourId - Tour ID
   * @param {FormData} formData - Form data with images
   */
  updateTourImages: (tourId, formData) => {
    return api.put(`/tours/${tourId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default tourService;