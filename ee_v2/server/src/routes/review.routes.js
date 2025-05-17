import { Router } from "express";
import { reviewController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

const reviewRouter = Router();

reviewRouter.route("/tour/:tourId").get(reviewController.getTourReviews);
reviewRouter.route("/:reviewId").get(reviewController.getReviewById);

reviewRouter.use(auth.authenticate);

reviewRouter.route("/").post(reviewController.createReview);
reviewRouter
  .route("/:reviewId")
  .put(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default reviewRouter;