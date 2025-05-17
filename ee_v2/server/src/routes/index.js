import { Router } from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import chatRouter from "./chat.routes.js";
import msgRouter from "./message.routes.js";
import tourRouter from "./tour.routes.js";
import blogRouter from "./blog.routes.js";
import reviewRouter from "./review.routes.js";
import commentRouter from "./comment.routes.js";

const router = Router();

router.use("/check-health", healthRouter);
router.use("/auth", authRouter);
router.use("/u", userRouter);
router.use("/chats", chatRouter);
router.use("/messages", msgRouter);
router.use("/tours", tourRouter);
router.use("/blogs", blogRouter);
router.use("/reviews", reviewRouter);
router.use("/comments", commentRouter);

export default router;