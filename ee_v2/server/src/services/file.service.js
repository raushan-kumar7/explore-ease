// import fs from "fs";
// import path from "path";
// import { ApiError } from "../utils/index.js";
// import { cloudinary } from "../config/index.js";

// /**
//  * Uploads a file locally
//  * @param {string} localFilePath - Local file path
//  * @param {string} folder - Folder name in local storage
//  * @returns {Promise<string>} - Local file URL
//  */
// const uploadLocalFile = async (localFilePath, folder = "avatars") => {
//   try {
//     if (!localFilePath) return null;
    
//     // Create uploads directory if it doesn't exist
//     const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
    
//     // Generate a unique filename
//     const fileName = `${Date.now()}-${path.basename(localFilePath)}`;
//     const destPath = path.join(uploadsDir, fileName);
    
//     // Copy file to uploads directory
//     fs.copyFileSync(localFilePath, destPath);
    
//     // Remove the temp file
//     fs.unlinkSync(localFilePath);
    
//     // Return the relative path
//     return `/public/uploads/${folder}/${fileName}`;
//   } catch (error) {
//     // Remove the locally saved temp file if upload fails
//     if (localFilePath && fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     throw new ApiError(500, error?.message || "Error uploading file locally");
//   }
// };

// /**
//  * Uploads a file to cloudinary
//  * @param {string} localFilePath - Local file path
//  * @param {string} folder - Folder name in cloudinary
//  * @returns {Promise<string>} - Cloudinary URL
//  */
// const uploadToCloudinary = async (localFilePath, folder = "avatars") => {
//   try {
//     if (!localFilePath) return null;
    
//     // Upload to cloudinary
//     const result = await cloudinary.uploader.upload(localFilePath, {
//       folder,
//       resource_type: "auto",
//     });
    
//     // File uploaded successfully
//     fs.unlinkSync(localFilePath); // Clean up the local file
//     return result.secure_url;
//   } catch (error) {
//     // Remove the locally saved temp file if upload fails
//     if (localFilePath && fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     throw new ApiError(500, error?.message || "Error uploading file to cloudinary");
//   }
// };

// /**
//  * Deletes a file from cloudinary
//  * @param {string} cloudinaryUrl - Cloudinary URL
//  * @returns {Promise<Object>} - Deletion status
//  */
// const deleteFromCloudinary = async (cloudinaryUrl) => {
//   try {
//     if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary")) return null;
    
//     // Extract the public_id from the URL
//     const publicId = cloudinaryUrl.split("/").slice(-2).join("/").split(".")[0];
    
//     if (!publicId) return null;
    
//     // Delete from cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     throw new ApiError(500, error?.message || "Error deleting file from cloudinary");
//   }
// };

// /**
//  * Deletes a local file
//  * @param {string} localFilePath - Local file path
//  * @returns {Promise<boolean>} - Deletion status
//  */
// const deleteLocalFile = async (localFilePath) => {
//   try {
//     if (!localFilePath || !localFilePath.startsWith("/public/uploads")) return null;
    
//     const fullPath = path.join(process.cwd(), localFilePath.substring(1));
    
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//       return true;
//     }
    
//     return false;
//   } catch (error) {
//     throw new ApiError(500, error?.message || "Error deleting local file");
//   }
// };

// /**
//  * Upload file based on storage preference
//  * @param {string} localFilePath - Local file path
//  * @param {string} folder - Folder name
//  * @param {boolean} useCloudinary - Whether to use cloudinary or local storage
//  * @returns {Promise<string>} - File URL
//  */
// const uploadFile = async (localFilePath, folder = "avatars", useCloudinary = true) => {
//   if (useCloudinary) {
//     return await uploadToCloudinary(localFilePath, folder);
//   }
//   return await uploadLocalFile(localFilePath, folder);
// };

// /**
//  * Upload multiple files
//  * @param {Array} filePaths - Array of local file paths
//  * @param {string} folder - Folder name
//  * @param {boolean} useCloudinary - Whether to use cloudinary or local storage
//  * @returns {Promise<Array>} - Array of file URLs
//  */
// const uploadMultipleFiles = async (filePaths, folder = "uploads", useCloudinary = true) => {
//   if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
//     return [];
//   }
  
//   const uploadPromises = filePaths.map(filePath => uploadFile(filePath, folder, useCloudinary));
//   return await Promise.all(uploadPromises);
// };

// /**
//  * Delete file based on URL
//  * @param {string} fileUrl - File URL
//  * @returns {Promise<boolean>} - Deletion status
//  */
// const deleteFile = async (fileUrl) => {
//   if (!fileUrl) return null;
  
//   if (fileUrl.includes("cloudinary")) {
//     return await deleteFromCloudinary(fileUrl);
//   }
  
//   return await deleteLocalFile(fileUrl);
// };

// export {
//   uploadToCloudinary,
//   deleteFromCloudinary,
//   uploadLocalFile,
//   deleteLocalFile,
//   uploadFile,
//   uploadMultipleFiles,
//   deleteFile
// };


import fs from "fs";
import path from "path";
import { ApiError } from "../utils/index.js";
import { cloudinary } from "../config/index.js";

/**
 * Uploads a file locally
 * @param {string} localFilePath - Local file path
 * @param {string} folder - Folder name in local storage
 * @returns {Promise<string>} - Local file URL
 */
const uploadLocalFile = async (localFilePath, folder = "avatars") => {
  try {
    if (!localFilePath) return null;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileName = `${Date.now()}-${path.basename(localFilePath)}`;
    const destPath = path.join(uploadsDir, fileName);
    
    // Copy file to uploads directory
    fs.copyFileSync(localFilePath, destPath);
    
    // Remove the temp file
    fs.unlinkSync(localFilePath);
    
    // Return the relative path that will be correctly served from the public directory
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    // Remove the locally saved temp file if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new ApiError(500, error?.message || "Error uploading file locally");
  }
};

/**
 * Uploads a file to cloudinary
 * @param {string} localFilePath - Local file path
 * @param {string} folder - Folder name in cloudinary
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadToCloudinary = async (localFilePath, folder = "avatars") => {
  try {
    if (!localFilePath) return null;
    
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });
    
    // File uploaded successfully
    fs.unlinkSync(localFilePath); // Clean up the local file
    return result.secure_url;
  } catch (error) {
    // Remove the locally saved temp file if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new ApiError(500, error?.message || "Error uploading file to cloudinary");
  }
};

/**
 * Deletes a file from cloudinary
 * @param {string} cloudinaryUrl - Cloudinary URL
 * @returns {Promise<Object>} - Deletion status
 */
const deleteFromCloudinary = async (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary")) return null;
    
    // Extract the public_id from the URL
    const publicId = cloudinaryUrl.split("/").slice(-2).join("/").split(".")[0];
    
    if (!publicId) return null;
    
    // Delete from cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ApiError(500, error?.message || "Error deleting file from cloudinary");
  }
};

/**
 * Deletes a local file
 * @param {string} localFilePath - Local file path
 * @returns {Promise<boolean>} - Deletion status
 */
const deleteLocalFile = async (localFilePath) => {
  try {
    if (!localFilePath || !localFilePath.startsWith("/uploads")) return null;
    
    const fullPath = path.join(process.cwd(), "public", localFilePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    throw new ApiError(500, error?.message || "Error deleting local file");
  }
};

/**
 * Upload file based on storage preference
 * @param {string} localFilePath - Local file path
 * @param {string} folder - Folder name
 * @param {boolean} useCloudinary - Whether to use cloudinary or local storage
 * @returns {Promise<string>} - File URL
 */
const uploadFile = async (localFilePath, folder = "avatars", useCloudinary = true) => {
  if (useCloudinary) {
    return await uploadToCloudinary(localFilePath, folder);
  }
  return await uploadLocalFile(localFilePath, folder);
};

/**
 * Upload multiple files
 * @param {Array} filePaths - Array of local file paths
 * @param {string} folder - Folder name
 * @param {boolean} useCloudinary - Whether to use cloudinary or local storage
 * @returns {Promise<Array>} - Array of file URLs
 */
const uploadMultipleFiles = async (filePaths, folder = "uploads", useCloudinary = true) => {
  if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
    return [];
  }
  
  const uploadPromises = filePaths.map(filePath => uploadFile(filePath, folder, useCloudinary));
  return await Promise.all(uploadPromises);
};

/**
 * Delete file based on URL
 * @param {string} fileUrl - File URL
 * @returns {Promise<boolean>} - Deletion status
 */
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return null;
  
  if (fileUrl.includes("cloudinary")) {
    return await deleteFromCloudinary(fileUrl);
  }
  
  return await deleteLocalFile(fileUrl);
};

export {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadLocalFile,
  deleteLocalFile,
  uploadFile,
  uploadMultipleFiles,
  deleteFile
};