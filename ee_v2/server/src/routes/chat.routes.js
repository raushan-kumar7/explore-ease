import { Router } from "express";
import { auth } from "../middlewares/index.js";
import { chatController } from "../controllers/index.js";

const chatRouter = Router();

chatRouter.use(auth.authenticate);

chatRouter
  .route("/admin")
  .get(auth.authorizeRole("admin"), chatController.getAllChats);
chatRouter.route("/").get(chatController.getUserChats);
chatRouter.route("/:chatId").get(chatController.getChatById);
chatRouter.route("/").post(chatController.createChat);
chatRouter.route("/:chatId").delete(chatController.deactivateChat);

export default chatRouter;
