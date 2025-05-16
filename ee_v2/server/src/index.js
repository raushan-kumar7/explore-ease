import dotenv from "dotenv";
import http from "http";
import { connectDB, socket } from "./config/index.js";
import { app, setupRoutes } from "./app.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 3300;
setupRoutes();

// Create HTTP server from Express app
const server = http.createServer(app);

// Connect to database and start server
connectDB()
  .then(async () => {
    // Configure socket.io after database connection
    try {
      const io = await socket.configureSocket(server);

      // Store socket.io instance on app for use in routes if needed
      app.set("io", io);

      server.listen(PORT, () => {
        console.log(`
        ====================================================
        🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
        🔗 http://localhost:${PORT}
        🔌 Socket.IO server configured and running
        ====================================================
        `);
      });
    } catch (error) {
      console.error("Failed to configure Socket.IO:", error);
      server.listen(PORT, () => {
        console.log(`
        ====================================================
        🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
        🔗 http://localhost:${PORT}
        ⚠️ Warning: Socket.IO configuration failed
        ====================================================
        `);
      });
    }
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
