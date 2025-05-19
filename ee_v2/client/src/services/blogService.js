import api from "@/utils/axios";

/**
 * Blog service for handling blog operations
 */
const blogService = {
  /**
   * Get all blogs
   * @param {Object} params - Query parameters for filtering blogs
   */
  getAllBlogs: (params = {}) => {
    return api.get("/blogs", { params });
  },

  /**
   * Search blogs
   * @param {Object} searchParams - Search parameters
   */
  searchBlogs: (searchParams) => {
    return api.get("/blogs/search", { params: searchParams });
  },

  /**
   * Get blogs by tag
   * @param {string} tag - Tag to filter by
   * @param {Object} params - Additional query parameters
   */
  getBlogsByTag: (tag, params = {}) => {
    return api.get(`/blogs/tags/${tag}`, { params });
  },

  /**
   * Get blog by ID or slug
   * @param {string} idOrSlug - Blog ID or slug
   */
  getBlogByIdOrSlug: (idOrSlug) => {
    return api.get(`/blogs/${idOrSlug}`);
  },

  /**
   * Create a new blog (admin only)
   * @param {FormData} formData - Blog data with image
   */
  createBlog: (formData) => {
    return api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update blog (admin only)
   * @param {string} blogId - Blog ID
   * @param {Object} blogData - Blog data to update
   */
  updateBlog: (blogId, blogData) => {
    return api.put(`/blogs/${blogId}`, blogData);
  },

  /**
   * Delete blog (admin only)
   * @param {string} blogId - Blog ID
   */
  deleteBlog: (blogId) => {
    return api.delete(`/blogs/${blogId}`);
  },

  /**
   * Update blog image (admin only)
   * @param {string} blogId - Blog ID
   * @param {FormData} formData - Form data with image
   */
  updateBlogImage: (blogId, formData) => {
    return api.patch(`/blogs/${blogId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default blogService;