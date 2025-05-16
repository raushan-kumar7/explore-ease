import { Router } from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import chatRouter from "./chat.routes.js";
import msgRouter from "./message.routes.js";

const router = Router();

router.use("/check-health", healthRouter);
router.use("/auth", authRouter);
router.use("/u", userRouter);
router.use("/chats", chatRouter);
router.use("/messages", msgRouter);

export default router;