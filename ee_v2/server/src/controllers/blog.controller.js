import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { blogService } from "../services/index.js";

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Private (Admin)
 */
const createBlog = asyncHandler(async (req, res) => {
  const blogData = req.body;

  // Add blog image from uploaded file if available
  if (req.file) {
    blogData.image = req.file.path;
  }

  const blog = await blogService.createBlog(blogData);

  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  const result = await blogService.getAllBlogs({}, options);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Blogs fetched successfully"));
});

/**
 * @desc    Get blog by ID or slug
 * @route   GET /api/blogs/:idOrSlug
 * @access  Public
 */
const getBlogByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const blog = await blogService.getBlogByIdOrSlug(idOrSlug);

  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:blogId
 * @access  Private (Admin)
 */
const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const updateData = req.body;

  const updatedBlog = await blogService.updateBlog(blogId, updateData);

  res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:blogId
 * @access  Private (Admin)
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  await blogService.deleteBlog(blogId);

  res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

/**
 * @desc    Update blog image
 * @route   PUT /api/blogs/:blogId/image
 * @access  Private (Admin)
 */
const updateBlogImage = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const updatedBlog = await blogService.updateBlogImage(blogId, req.file.path);

  res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog image updated successfully"));
});

/**
 * @desc    Search blogs
 * @route   GET /api/blogs/search
 * @access  Public
 */
const searchBlogs = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await blogService.searchBlogs(q, options);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Search results fetched successfully"));
});

/**
 * @desc    Get blogs by tag
 * @route   GET /api/blogs/tag/:tag
 * @access  Public
 */
const getBlogsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await blogService.getBlogsByTag(tag, options);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Blogs fetched successfully"));
});

export {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  updateBlogImage,
  searchBlogs,
  getBlogsByTag,
};