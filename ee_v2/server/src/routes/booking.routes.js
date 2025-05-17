import { Router } from "express";
import { auth } from "../middlewares/index.js";
import { bookingController } from "../controllers/index.js";

const bookingRouter = Router();

bookingRouter.use(auth.authenticate);

bookingRouter
  .route("/stats")
  .get(auth.authorizeRole("admin"), bookingController.getBookingStats);

bookingRouter.route("/").post(bookingController.createBooking);

bookingRouter.route("/my-bookings").get(bookingController.getUserBookings);

bookingRouter
  .route("/reference/:reference")
  .get(bookingController.getBookingByReference);

bookingRouter
  .route("/:id")
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// ADMIN access ROUTES
bookingRouter
  .route("/")
  .get(auth.authorizeRole("admin"), bookingController.getAllBookings);

bookingRouter
  .route("/:id/status")
  .patch(auth.authorizeRole("admin"), bookingController.updateBookingStatus);

export default bookingRouter;
