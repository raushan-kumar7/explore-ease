multer.middleware.js
import { multerConfig } from "../config/index.js";
import { ApiError, asyncHandler } from "../utils/index.js";

const createUserUploadMiddleware = (resourceType = "image") => {
  const fileTypes = ["image/jpeg", "image/png", "image/jpg"];

  const fileSize = multerConfig.FILE_SIZE_LIMITS;

  const uploader = multerConfig.createUploader({
    model: "users",
    identifierFn: (req) =>
      req.user?.username ||
      req.body?.username ||
      req.params.userId ||
      "unknown",
    resourceType,
    fileTypes,
    fileSize,
  });

  return {
    /**
     * Upload a single file for a user
     * @param {string} fieldName - Form field name
     */
    single: (fieldName) => {
      return asyncHandler(async (req, res, next) => {
        uploader.single(fieldName)(req, res, (err) => {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return next(
                new ApiError(
                  400,
                  `File too large. Max size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB`
                )
              );
            }
            return next(err);
          }
          next();
        });
      });
    },

    /**
     * Upload multiple files for a user
     * @param {string} fieldName - Form field name
     * @param {number} maxCount - Maximum number of files
     */
    array: (fieldName, maxCount = 5) => {
      return asyncHandler(async (req, res, next) => {
        uploader.array(fieldName, maxCount)(req, res, (err) => {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return next(
                new ApiError(
                  400,
                  `File too large. Max size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB`
                )
              );
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
              return next(
                new ApiError(400, `Too many files. Maximum is ${maxCount}`)
              );
            }
            return next(err);
          }

          next();
        });
      });
    },
  };
};

/**
 * Create upload middleware for blog-related files
 * @param {string} resourceType - 'image' only
 * @returns {Object} - Object with single and multiple upload methods
 */
const createBlogUploadMiddleware = (resourceType = "image") => {
  const uploader = multerConfig.createUploader({
    model: "blogs",
    identifierFn: (req) => req.params.blogId || req.body.blogId || "unknown",
    resourceType,
    fileTypes: ["image/jpeg", "image/png", "image/jpg"],
    fileSize: multerConfig.FILE_SIZE_LIMITS.IMAGE,
  });

  return {
    single: (fieldName) => {
      return asyncHandler(async (req, res, next) => {
        uploader.single(fieldName)(req, res, (err) => {
          if (err) {
            return next(err);
          }
          next();
        });
      });
    },

    array: (fieldName, maxCount = 10) => {
      return asyncHandler(async (req, res, next) => {
        uploader.array(fieldName, maxCount)(req, res, (err) => {
          if (err) {
            return next(err);
          }
          next();
        });
      });
    },
  };
};

/**
 * Create upload middleware for tour-related files
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Object} - Object with single and multiple upload methods
 */
const createTourUploadMiddleware = (resourceType = "image") => {
  // Define allowed file types based on resource type
  let fileTypes = ["image/jpeg", "image/png", "image/jpg"];
  let fileSize = multerConfig.FILE_SIZE_LIMITS.IMAGE;

  if (resourceType === "video") {
    fileTypes = ["video/mp4", "video/quicktime", "video/webm"];
    fileSize = multerConfig.FILE_SIZE_LIMITS.VIDEO;
  }

  const uploader = multerConfig.createUploader({
    model: "tours",
    identifierFn: (req) => req.params.tourId || req.body.tourId || "unknown",
    resourceType,
    fileTypes,
    fileSize,
  });

  return {
    single: (fieldName) => {
      return asyncHandler(async (req, res, next) => {
        uploader.single(fieldName)(req, res, (err) => {
          if (err) {
            return next(err);
          }
          next();
        });
      });
    },

    array: (fieldName, maxCount = 20) => {
      return asyncHandler(async (req, res, next) => {
        uploader.array(fieldName, maxCount)(req, res, (err) => {
          if (err) {
            return next(err);
          }
          next();
        });
      });
    },
  };
};

/**
 * Create upload middleware for message attachments
 * @param {string} resourceType - 'attachment'
 * @returns {Object} - Object with single and multiple upload methods
 */
const createMessageUploadMiddleware = (resourceType = "attachment") => {
  // Allow various file types for message attachments
  const fileTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    // Video
    "video/mp4",
    "video/quicktime",
  ];

  const fileSize = multerConfig.FILE_SIZE_LIMITS.ATTACHMENT || 10 * 1024 * 1024; // Default 10MB if not specified

  const uploader = multerConfig.createUploader({
    model: "messages",
    identifierFn: (req) => req.params.chatId || "unknown",
    resourceType,
    fileTypes,
    fileSize,
  });

  return {
    /**
     * Upload a single attachment
     * @param {string} fieldName - Form field name
     */
    single: (fieldName) => {
      return asyncHandler(async (req, res, next) => {
        uploader.single(fieldName)(req, res, (err) => {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return next(
                new ApiError(
                  400,
                  `File too large. Max size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB`
                )
              );
            }
            return next(err);
          }
          next();
        });
      });
    },

    /**
     * Upload multiple attachments
     * @param {string} fieldName - Form field name
     * @param {number} maxCount - Maximum number of files
     */
    array: (fieldName, maxCount = 5) => {
      return asyncHandler(async (req, res, next) => {
        uploader.array(fieldName, maxCount)(req, res, (err) => {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return next(
                new ApiError(
                  400,
                  `File too large. Max size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB`
                )
              );
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
              return next(
                new ApiError(400, `Too many files. Maximum is ${maxCount}`)
              );
            }
            return next(err);
          }

          next();
        });
      });
    },
  };
};

const usrImgUpload = createUserUploadMiddleware("image");
const blogImgUpload = createBlogUploadMiddleware("image");
const tourImgUpload = createTourUploadMiddleware("image");
const tourVideoUpload = createTourUploadMiddleware("video");
const msgAttachmentUpload = createMessageUploadMiddleware("attachment");

export {
  usrImgUpload,
  blogImgUpload,
  tourImgUpload,
  tourVideoUpload,
  msgAttachmentUpload,
};

middlewares/index.js
import * as multerMiddleware from "./multer.middleware.js";
import * as auth from "./auth.middleware.js";
import * as err from "./error.middleware.js";

export { multerMiddleware, auth, err };

cloudinaey.service.js
import { cloudinary } from "../config/index.js";
import { ApiError } from "../utils/index.js";

/**
 * Delete a file from Cloudinary
 * @param {string} cloudinaryUrl - Full Cloudinary URL of the file
 * @returns {Promise<Object>} - Result of deletion operation
 */
const deleteFromCloudinary = async (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary")) {
      return null;
    }

    // Extract the public_id from the URL
    // Format example: https://res.cloudinary.com/cloud-name/image/upload/v1631234567/users/username/filename.jpg
    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
      throw new ApiError(400, "Invalid Cloudinary URL format");
    }

    // Get everything after "upload/" and remove file extension
    const publicId = urlParts
      .slice(uploadIndex + 1)
      .join("/")
      .split(".")[0];

    // Determine resource type from URL
    let resourceType = "image";
    if (urlParts.includes("video")) {
      resourceType = "video";
    } else if (urlParts.includes("raw")) {
      resourceType = "raw";
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Error deleting file from Cloudinary"
    );
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array} urls - Array of Cloudinary URLs
 * @returns {Promise<Array>} - Results of deletion operations
 */
const deleteMultipleFromCloudinary = async (urls = []) => {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return [];
  }

  const deletePromises = urls.map((url) => deleteFromCloudinary(url));
  return await Promise.all(deletePromises.map((p) => p.catch((e) => e)));
};

/**
 * Extract file metadata from Cloudinary URL
 * @param {string} cloudinaryUrl - Cloudinary URL
 * @returns {Object} - File metadata (model, identifier, filename)
 */
const getFileMetadata = (cloudinaryUrl) => {
  if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary")) {
    return null;
  }

  try {
    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 3 >= urlParts.length) {
      return null;
    }

    // Extract model and identifier
    const model = urlParts[uploadIndex + 1];
    const identifier = urlParts[uploadIndex + 2];
    const filename = urlParts[urlParts.length - 1];

    return {
      model,
      identifier,
      filename,
      path: `${model}/${identifier}`,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Check if the URL is from Cloudinary
 * @param {string} url - URL to check
 * @returns {boolean} - True if the URL is from Cloudinary
 */
const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") {
    return false;
  }
  return url.includes("cloudinary") && url.includes("upload");
};

/**
 * Updates a file in Cloudinary by deleting the old one and uploading a new one
 * @param {string} oldUrl - URL of the file to be replaced
 * @param {string} newFilePath - Local path of the new file
 * @param {Object} options - Upload options
 * @returns {Promise<string>} - URL of the newly uploaded file
 */
const updateInCloudinary = async (oldUrl, newFilePath, options = {}) => {
  try {
    // Delete the old file if it exists and is a valid Cloudinary URL
    if (oldUrl && isCloudinaryUrl(oldUrl)) {
      await deleteFromCloudinary(oldUrl);
    }

    // Extract folder information from the old URL or use provided folder
    let folder = options.folder || "uploads";

    if (oldUrl && isCloudinaryUrl(oldUrl)) {
      const metadata = getFileMetadata(oldUrl);
      if (metadata && metadata.path) {
        folder = metadata.path;
      }
    }

    // Upload the new file
    const result = await cloudinary.uploader.upload(newFilePath, {
      folder,
      resource_type: options.resourceType || "auto",
      ...options,
    });

    return result.secure_url;
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Error updating file in Cloudinary"
    );
  }
};

export {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  getFileMetadata,
  isCloudinaryUrl,
  updateInCloudinary,
};

file.service.js

import { cloudinary } from "../config/index.js";
import { ApiError } from "../utils/index.js";
import { deleteFromCloudinary, isCloudinaryUrl, updateInCloudinary } from "./cloudinary.service.js";

/**
 * Upload a file to storage (local or Cloudinary)
 * @param {string} filePath - Path to the uploaded file
 * @param {boolean} useCloudinary - Whether to use Cloudinary or local storage
 * @param {Object} options - Additional options for Cloudinary upload
 * @returns {Promise<string>} - URL of the uploaded file
 */
const uploadFile = async (filePath, useCloudinary = true, options = {}) => {
  try {
    // If Cloudinary is enabled, upload to Cloudinary
    if (useCloudinary) {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: options.resourceType || "auto",
        folder: options.folder || "uploads",
        ...options,
      });
      return result.secure_url;
    }
    
    // For local storage, just return the file path
    // In a real application, you might want to modify this path to be accessible
    return filePath;
  } catch (error) {
    throw new ApiError(500, error?.message || "Error uploading file");
  }
};

/**
 * Delete a file from storage (local or Cloudinary)
 * @param {string} fileUrl - URL or path of the file to delete
 * @returns {Promise<boolean>} - Whether the file was deleted successfully
 */
const deleteFile = async (fileUrl) => {
  try {
    // If it's a Cloudinary URL, delete from Cloudinary
    if (isCloudinaryUrl(fileUrl)) {
      await deleteFromCloudinary(fileUrl);
      return true;
    }
    
    // For local files, implement file system deletion
    // This is a placeholder - in a real app, you'd use fs.unlink
    console.log(`Would delete local file: ${fileUrl}`);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

export {
  uploadFile,
  deleteFile
};

sercices/index.js
import * as health from "./health.service.js";
import * as usr from "./user.service.js";
import * as file from "./file.service.js";
import * as chat from "./chat.service.js";
import * as message from "./message.service.js";

export { health, usr, file, chat, message };

tour.model.js
import mongoose, { Schema } from "mongoose";

const tourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1740676492/ExploreEase/travelbadge_llbyae.jpg",
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1740676491/ExploreEase/map-nav_fucdyc.jpg",
      ],
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;

blog.model.js
import mongoose, { Schema } from "mongoose";
import slug from "slugify";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1739528025/Tours/blog-default-image_ihqhmd.jpg",
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.title) {
    this.slug = slug(this.title, { lower: true, strict: true });
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

comment.model.js
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

review.model.js
import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
    },
    username: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;


models/index.js
import User from "./user.model.js";
import Chat from "./chat.model.js";
import Message from "./message.model.js";
import Tour from "./tour.model.js";
import Blog from "./blog.model.js";
import Review from "./review.model.js";
import Comment from "./comment.model.js";

export { User, Chat, Message, Tour, Blog, Review, Comment };

