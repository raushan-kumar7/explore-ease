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