import { Router } from "express";
import { commentController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

const commentRouter = Router();

commentRouter.route("/blog/:blogId").get(commentController.getBlogComments);
commentRouter.route("/:commentId").get(commentController.getCommentById);

commentRouter.use(auth.authenticate);

commentRouter.route("/").post(commentController.createComment);
commentRouter
  .route("/:commentId")
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);
commentRouter.route("/:commentId/like").post(commentController.likeComment);

export default commentRouter;