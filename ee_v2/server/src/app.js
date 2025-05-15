import express from "express";
import { securityConfig } from "./security/index.js";
import routes from "./routes/index.js";
import { err } from "./middlewares/index.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

// Apply all security configurations
securityConfig(app);

const setupRoutes = () => {
  app.use(`/api/${process.env.API_VERSION}`, routes);

  app.use(err.notFoundMiddleware);

  app.use(err.errorMiddleware);
};

export { app, setupRoutes };
