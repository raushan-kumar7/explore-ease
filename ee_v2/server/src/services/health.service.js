import os from "os";
import { version as nodeVersion } from "process";
import path from "path";
import fs from "fs";

/**
 * Comprehensive health check function that provides detailed information about:
 * - Server status
 * - Runtime environment
 * - Node.js information
 * - System resources
 * - Database connections
 * - Cloudinary configuration
 * - Multer/file upload configuration
 */
const checkHealth = () => {
  // Get package.json information
  let packageInfo = {};
  try {
    const packagePath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packagePath)) {
      packageInfo = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    }
  } catch (err) {
    packageInfo = { error: "Unable to read package.json" };
  }

  // Detect Cloudinary configuration
  const cloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

  // Detect Multer configuration
  let multerConfig = {
    configured: false,
    storageType: "unknown",
  };

  if (process.env.MULTER_STORAGE_TYPE) {
    multerConfig.configured = true;
    multerConfig.storageType = process.env.MULTER_STORAGE_TYPE;
  } else if (process.env.FILE_UPLOAD_PATH) {
    multerConfig.configured = true;
    multerConfig.storageType = "disk";
    multerConfig.uploadPath = process.env.FILE_UPLOAD_PATH;
  }

  // Check if specific directories exist for file uploads
  if (process.env.UPLOAD_DIR) {
    try {
      multerConfig.uploadDirExists = fs.existsSync(process.env.UPLOAD_DIR);
    } catch (err) {
      multerConfig.uploadDirExists = false;
    }
  }

  return {
    status: "ok",
    uptime: {
      seconds: process.uptime(),
      formatted: formatUptime(process.uptime()),
    },
    timestamp: new Date(),
    message: "Server is running & healthy",

    // Node.js information
    node: {
      version: nodeVersion,
      environment: process.env.NODE_ENV || "not set",
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      appVersion: packageInfo.version || "unknown",
    },

    // System resources
    system: {
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAvg: os.loadavg(),
    },

    // Service configuration
    environment: {
      NODE_ENV: process.env.NODE_ENV || "not set",
      SERVER_PORT: process.env.SERVER_PORT || process.env.PORT || "not set",
      API_VERSION: process.env.API_VERSION || "not set",

      // Database information
      DB_NAME: process.env.DB_NAME || "not set",
      DB_URI: process.env.MONGODB_URI ? "configured" : "not configured",
      DB_CONNECTION: global.mongoDBConnected ? "connected" : "disconnected",
    },

    // Cloudinary configuration
    cloudinary: {
      configured: cloudinaryConfigured,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
        ? "configured"
        : "not configured",
      resourceTypes: process.env.CLOUDINARY_ALLOWED_FORMATS
        ? process.env.CLOUDINARY_ALLOWED_FORMATS.split(",")
        : ["image/*"],
      folderName: process.env.CLOUDINARY_FOLDER || "uploads",
    },

    // Multer configuration
    fileUploads: multerConfig,

    // External service health
    services: {
      database: global.mongoDBConnected ? "healthy" : "not connected",
      smtp: Boolean(process.env.SMTP_HOST) ? "configured" : "not configured",
    },

    // Security
    security: {
      corsEnabled: Boolean(process.env.CORS_ENABLED !== "false"),
      rateLimitEnabled: Boolean(process.env.RATE_LIMIT_ENABLED !== "false"),
      helmetEnabled: Boolean(process.env.HELMET_ENABLED !== "false"),
      jwtSecret:
        process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET
          ? "configured"
          : "not configured",
    },
  };
};

/**
 * Formats uptime seconds into human-readable format
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

export { checkHealth };