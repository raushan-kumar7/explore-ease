import { Router } from "express";
import { blogController } from "../controllers/index.js";
import { auth, multerMiddleware } from "../middlewares/index.js";

const blogRouter = Router();

blogRouter.route("/").get(blogController.getAllBlogs);
blogRouter.route("/search").get(blogController.searchBlogs);
blogRouter.route("/tags/:tag").get(blogController.getBlogsByTag);
blogRouter.route("/:idOrSlug").get(blogController.getBlogByIdOrSlug);

// PRIVATE ROUTES - ADMIN access
blogRouter.use(auth.authenticate);
blogRouter.use(auth.authorizeRole("admin"));

blogRouter
  .route("/")
  .post(
    multerMiddleware.blogImgUpload.single("image"),
    blogController.createBlog
  );
blogRouter
  .route("/:blogId")
  .put(blogController.updateBlog)
  .delete(blogController.deleteBlog);
blogRouter
  .route("/:blogId/image")
  .patch(
    multerMiddleware.blogImgUpload.single("image"),
    blogController.updateBlogImage
  );

export default blogRouter;