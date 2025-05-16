import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { cloudinary } from "./index.js";
import { ApiError } from "../utils/index.js";

/**
 * Create a CloudinaryStorage instance with dynamic folder path
 * @param {string} resourceType - Type of resource ('image', 'raw', 'video', etc.)
 * @param {Function} folderGenerator - Function to generate folder path based on request
 * @returns {CloudinaryStorage} - Configured storage instance
 */
const createCloudinaryStorage = (resourceType = "image", folderGenerator) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      resource_type: resourceType,
      allowed_formats:
        resourceType === "image" ? ["jpg", "jpeg", "png"] : undefined,
      folder: folderGenerator,
      transformation:
        resourceType === "image" ? [{ quality: "auto" }] : undefined,
    },
  });
};

const PROJECT_NAME = process.env.DB_NAME || "explore-ease";
/**
 * Generate folder path based on model and identifier
 * @param {string} model - Model name (e.g., 'users', 'blogs', 'tours')
 * @param {Function} identifierFn - Function to extract identifier from request
 * @returns {Function} - Folder generator function
 */
const generateFolderPath = (model, identifierFn) => {
  return (req, file) => {
    const identifier = identifierFn(req);
    if (!identifier) {
      throw new ApiError(400, `No identifier found for ${model}`);
    }
    return `${PROJECT_NAME}/${model}/${identifier}`;
  };
};

/**
 * Create multer file filter for specific file types
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {Function} - File filter function
 */
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          400,
          `Unsupported file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(", ")}`
        ),
        false
      );
    }
  };
};

// Default file size limits (in bytes)
const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
};

/**
 * Create a configured multer instance
 * @param {Object} options - Configuration options
 * @returns {Object} - Configured multer instance
 */
const createUploader = ({
  model = "uploads",
  identifierFn = (req) => "default",
  resourceType = "image",
  fileTypes = ["image/jpeg", "image/png", "image/jpg"],
  fileSize = FILE_SIZE_LIMITS.IMAGE,
}) => {
  const storage = createCloudinaryStorage(
    resourceType,
    generateFolderPath(model, identifierFn)
  );

  return multer({
    storage,
    fileFilter: fileFilter(fileTypes),
    limits: {
      fileSize,
    },
  });
};

export { createUploader, FILE_SIZE_LIMITS };