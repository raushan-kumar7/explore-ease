// import { Blog, Comment } from "../models/index.js";
// import { ApiError } from "../utils/index.js";
// import { deleteFromCloudinary } from "./cloudinary.service.js";

// /**
//  * Create a new blog
//  * @param {Object} blogData - Blog details
//  * @returns {Promise<Object>} - Created blog object
//  */
// const createBlog = async (blogData) => {
//   try {
//     const blog = await Blog.create(blogData);
//     return blog;
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error creating blog"
//     );
//   }
// };

// /**
//  * Get all blogs with optional filtering
//  * @param {Object} filter - Filter options
//  * @param {Object} options - Pagination and sorting options
//  * @returns {Promise<Object>} - Object containing blogs and pagination info
//  */
// const getAllBlogs = async (filter = {}, options = {}) => {
//   const { page = 1, limit = 10, sort = "-createdAt" } = options;
//   const skip = (page - 1) * limit;

//   try {
//     const blogs = await Blog.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const totalBlogs = await Blog.countDocuments(filter);

//     return {
//       blogs,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalBlogs / limit),
//         totalItems: totalBlogs,
//         itemsPerPage: limit,
//       },
//     };
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error fetching blogs"
//     );
//   }
// };

// /**
//  * Get blog by ID or slug
//  * @param {string} identifier - Blog ID or slug
//  * @returns {Promise<Object>} - Blog object
//  */
// const getBlogByIdOrSlug = async (identifier) => {
//   try {
//     let blog;

//     // Check if identifier is an ObjectId
//     if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
//       blog = await Blog.findById(identifier);
//     } else {
//       // Assume it's a slug
//       blog = await Blog.findOne({ slug: identifier });
//     }

//     if (!blog) {
//       throw new ApiError(404, "Blog not found");
//     }

//     return blog;
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error fetching blog"
//     );
//   }
// };

// /**
//  * Update blog details
//  * @param {string} blogId - Blog ID
//  * @param {Object} updateData - Updated blog data
//  * @returns {Promise<Object>} - Updated blog object
//  */
// const updateBlog = async (blogId, updateData) => {
//   try {
//     const blog = await Blog.findByIdAndUpdate(blogId, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!blog) {
//       throw new ApiError(404, "Blog not found");
//     }

//     return blog;
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error updating blog"
//     );
//   }
// };

// /**
//  * Delete a blog
//  * @param {string} blogId - Blog ID
//  * @returns {Promise<Object>} - Deleted blog object
//  */
// const deleteBlog = async (blogId) => {
//   try {
//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       throw new ApiError(404, "Blog not found");
//     }

//     // Delete blog image from Cloudinary if it's not the default image
//     if (
//       blog.image &&
//       !blog.image.includes("blog-default-image")
//     ) {
//       await deleteFromCloudinary(blog.image);
//     }

//     // Delete associated comments
//     await Comment.deleteMany({ blog: blogId });

//     // Delete the blog
//     await Blog.findByIdAndDelete(blogId);

//     return blog;
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error deleting blog"
//     );
//   }
// };

// /**
//  * Update blog image
//  * @param {string} blogId - Blog ID
//  * @param {string} imageUrl - New image URL
//  * @returns {Promise<Object>} - Updated blog object
//  */
// const updateBlogImage = async (blogId, imageUrl) => {
//   try {
//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       throw new ApiError(404, "Blog not found");
//     }

//     // Delete previous image if it's not the default
//     if (
//       blog.image &&
//       !blog.image.includes("blog-default-image")
//     ) {
//       await deleteFromCloudinary(blog.image);
//     }

//     blog.image = imageUrl;
//     await blog.save();

//     return blog;
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error updating blog image"
//     );
//   }
// };

// /**
//  * Search blogs by title, description or tags
//  * @param {string} query - Search query
//  * @param {Object} options - Pagination options
//  * @returns {Promise<Object>} - Object containing matching blogs and pagination info
//  */
// const searchBlogs = async (query, options = {}) => {
//   const { page = 1, limit = 10 } = options;
//   const skip = (page - 1) * limit;

//   try {
//     const searchFilter = {
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { slug: { $regex: query, $options: "i" } },
//         { description: { $regex: query, $options: "i" } },
//         { tags: { $in: [new RegExp(query, "i")] } },
//       ],
//     };

//     const blogs = await Blog.find(searchFilter)
//       .sort("-createdAt")
//       .skip(skip)
//       .limit(limit);

//     const totalBlogs = await Blog.countDocuments(searchFilter);

//     return {
//       blogs,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalBlogs / limit),
//         totalItems: totalBlogs,
//         itemsPerPage: limit,
//       },
//     };
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error searching blogs"
//     );
//   }
// };

// /**
//  * Get blogs by tag
//  * @param {string} tag - Tag to filter by
//  * @param {Object} options - Pagination options
//  * @returns {Promise<Object>} - Object containing matching blogs and pagination info
//  */
// const getBlogsByTag = async (tag, options = {}) => {
//   try {
//     return await searchBlogs(tag, options);
//   } catch (error) {
//     throw new ApiError(
//       error.statusCode || 500,
//       error.message || "Error fetching blogs by tag"
//     );
//   }
// };

// export {
//   createBlog,
//   getAllBlogs,
//   getBlogByIdOrSlug,
//   updateBlog,
//   deleteBlog,
//   updateBlogImage,
//   searchBlogs,
//   getBlogsByTag,
// };

import { Blog, Comment } from "../models/index.js";
import { ApiError } from "../utils/index.js";
import { deleteFromCloudinary } from "./cloudinary.service.js";

/**
 * Create a new blog
 * @param {Object} blogData - Blog details
 * @returns {Promise<Object>} - Created blog object
 */
const createBlog = async (blogData) => {
  try {
    const blog = await Blog.create(blogData);
    return await Blog.findById(blog._id).populate("author", "firstName lastName username email avatar");
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating blog"
    );
  }
};

/**
 * Get all blogs with optional filtering
 * @param {Object} filter - Filter options
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Object>} - Object containing blogs and pagination info
 */
const getAllBlogs = async (filter = {}, options = {}) => {
  const { page = 1, limit = 9, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName username email avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(filter);

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalItems: totalBlogs,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching blogs"
    );
  }
};

/**
 * Get blog by ID or slug
 * @param {string} identifier - Blog ID or slug
 * @returns {Promise<Object>} - Blog object
 */
const getBlogByIdOrSlug = async (identifier) => {
  try {
    let blog;

    // Check if identifier is an ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      blog = await Blog.findById(identifier).populate("author", "firstName lastName username email avatar");
    } else {
      // Assume it's a slug
      blog = await Blog.findOne({ slug: identifier }).populate("author", "firstName lastName username email avatar");
    }

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching blog"
    );
  }
};

/**
 * Update blog details
 * @param {string} blogId - Blog ID
 * @param {Object} updateData - Updated blog data
 * @returns {Promise<Object>} - Updated blog object
 */
const updateBlog = async (blogId, updateData) => {
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "firstName lastName username email avatar");

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating blog"
    );
  }
};

/**
 * Delete a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise<Object>} - Deleted blog object
 */
const deleteBlog = async (blogId) => {
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Delete blog image from Cloudinary if it's not the default image
    if (
      blog.image &&
      !blog.image.includes("blog-default-image")
    ) {
      await deleteFromCloudinary(blog.image);
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blogId });

    // Delete the blog
    await Blog.findByIdAndDelete(blogId);

    return blog;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error deleting blog"
    );
  }
};

/**
 * Update blog image
 * @param {string} blogId - Blog ID
 * @param {string} imageUrl - New image URL
 * @returns {Promise<Object>} - Updated blog object
 */
const updateBlogImage = async (blogId, imageUrl) => {
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Delete previous image if it's not the default
    if (
      blog.image &&
      !blog.image.includes("blog-default-image")
    ) {
      await deleteFromCloudinary(blog.image);
    }

    blog.image = imageUrl;
    await blog.save();

    return await Blog.findById(blogId).populate("author", "firstName lastName username email avatar");
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error updating blog image"
    );
  }
};

/**
 * Search blogs by title, description or tags
 * @param {string} query - Search query
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Object containing matching blogs and pagination info
 */
const searchBlogs = async (query, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  try {
    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    };

    const blogs = await Blog.find(searchFilter)
      .populate("author", "firstName lastName username email avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(searchFilter);

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalItems: totalBlogs,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error searching blogs"
    );
  }
};

/**
 * Get blogs by tag
 * @param {string} tag - Tag to filter by
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Object containing matching blogs and pagination info
 */
const getBlogsByTag = async (tag, options = {}) => {
  try {
    return await searchBlogs(tag, options);
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching blogs by tag"
    );
  }
};

/**
 * Get blogs by author
 * @param {string} authorId - Author ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Object containing matching blogs and pagination info
 */
const getBlogsByAuthor = async (authorId, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  try {
    const filter = { author: authorId };

    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName username email avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(filter);

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalItems: totalBlogs,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error fetching blogs by author"
    );
  }
};

export {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  updateBlogImage,
  searchBlogs,
  getBlogsByTag,
  getBlogsByAuthor,
};