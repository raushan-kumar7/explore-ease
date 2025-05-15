import cors from "cors";
import cookieParser from "cookie-parser";
import { helmetSecurity } from "./helmet.security.js";
import { winstonConfig } from "./winston.security.js"
import { rateLimitConfig } from "./rateLimit.security.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}


export const securityConfig = (app) => {
  // Apply Helmet security
  app.use(helmetSecurity()),

  // Apply Rate Limiter
  app.use(rateLimitConfig()),

  // Apply CORS
  app.use(cors({
    origin: true,
    credentials: true,
  })),

  // Apply Cookie Parser
  app.use(cookieParser()),

  // Apply Winston Logger
  app.use((req, res, next) => {
    const logger = winstonConfig();
    logger.info(`${req.method} ${req.url}`);
    next();
  });
};