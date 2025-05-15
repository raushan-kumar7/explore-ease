import dotenv from "dotenv";
import { connectDB } from "./config/index.js";
import { app, setupRoutes } from "./app.js";

dotenv.config()

const PORT = process.env.SERVER_PORT || 3300;
setupRoutes();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
        ====================================================
        🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
        🔗 http://localhost:${PORT}
        ====================================================
        `);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });