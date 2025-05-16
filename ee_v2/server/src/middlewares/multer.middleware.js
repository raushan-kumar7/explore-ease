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

const usrImgUpload = createUserUploadMiddleware("image");
const blogImgUpload = createBlogUploadMiddleware("image");
const tourImgUpload = createTourUploadMiddleware("image");
const tourVideoUpload = createTourUploadMiddleware("video");

export { usrImgUpload, blogImgUpload, tourImgUpload, tourVideoUpload };