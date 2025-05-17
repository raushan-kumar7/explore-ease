import { Router } from "express";
import { auth, multerMiddleware } from "../middlewares/index.js";
import { tourController } from "../controllers/index.js";

const tourRouter = Router();

tourRouter.route("/search").get(tourController.searchTours);
tourRouter.route("/featured").get(tourController.getFeaturedTours);
tourRouter.route("/").get(tourController.getAllTours);
tourRouter.route("/:tourId").get(tourController.getTourById);

// PRIVATE ROUTES - ADMIN access
tourRouter.use(auth.authenticate);
tourRouter.use(auth.authorizeRole("admin"));

tourRouter
  .route("/")
  .post(
    multerMiddleware.tourImgUpload.array("images", 20),
    tourController.createTour
  );
tourRouter
  .route("/:tourId")
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);
tourRouter
  .route("/:tourId/images")
  .put(
    multerMiddleware.tourImgUpload.array("images", 20),
    tourController.updateTourImages
  );

export default tourRouter;