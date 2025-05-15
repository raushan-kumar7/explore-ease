import multer from "multer";
import { upload } from "../config/index.js";
import { ApiError, asyncHandler } from "../utils/index.js";

/**
 * Middleware for uploading a single image
 * @param {string} fieldName - Field name in the form
 * @returns {Function} - Express middleware
 */
const uploadSingleImage = (fieldName) => {
  return asyncHandler(async (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
          throw new ApiError(400, "File size is too large. Max size is 2MB");
        }
        throw new ApiError(400, err.message);
      } else if (err) {
        // An unknown error occurred
        throw new ApiError(
          500,
          err.message || "Something went wrong with file upload"
        );
      }

      // If no file was uploaded but the field was expected
      if (!req.file && fieldName) {
        throw new ApiError(400, `Please upload an image for ${fieldName}`);
      }

      next();
    });
  });
};

/**
 * Middleware for uploading multiple images
 * @param {string} fieldName - Field name in the form
 * @param {number} maxCount - Maximum number of files
 * @returns {Function} - Express middleware
 */
const uploadMultipleImages = (fieldName, maxCount = 5) => {
  return asyncHandler(async (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
          throw new ApiError(400, "File size is too large. Max size is 2MB");
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          throw new ApiError(400, `Too many files. Maximum is ${maxCount}`);
        }
        throw new ApiError(400, err.message);
      } else if (err) {
        // An unknown error occurred
        throw new ApiError(
          500,
          err.message || "Something went wrong with file upload"
        );
      }

      // If no files were uploaded but the field was expected
      if ((!req.files || req.files.length === 0) && fieldName) {
        throw new ApiError(400, `Please upload at least one image for ${fieldName}`);
      }

      next();
    });
  });
};

export { 
  uploadSingleImage,
  uploadMultipleImages
};