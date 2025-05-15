import { Router } from "express";
import { healthController } from "../controllers/index.js";

const healthRouter = Router();

healthRouter.route("/").get(healthController.checkHealthController);

export default healthRouter;