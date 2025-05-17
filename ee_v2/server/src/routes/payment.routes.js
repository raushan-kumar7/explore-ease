import { Router } from "express";
import { auth, webhook } from "../middlewares/index.js";
import { paymentController } from "../controllers/index.js";

const paymentRouter = Router();

paymentRouter.use(auth.authenticate);

paymentRouter.route("/").post(paymentController.createPayment);

paymentRouter
  .route("/transaction/:transactionId")
  .get(paymentController.getPaymentByTransactionId);

paymentRouter
  .route("/webhook")
  .post(webhook.verifyWebhook, paymentController.handlePaymentWebhook);

paymentRouter.route("/:id").get(paymentController.getPaymentById);

// ADMIN PROTECTED ROUTES
paymentRouter
  .route("/stats")
  .get(auth.authorizeRole("admin"), paymentController.getPaymentStats);

paymentRouter
  .route("/")
  .get(auth.authorizeRole("admin"), paymentController.getAllPayments);

paymentRouter
  .route("/:id/status")
  .patch(auth.authorizeRole("admin"), paymentController.updatePaymentStatus);

paymentRouter
  .route("/:id/refund")
  .post(auth.authorizeRole("admin"), paymentController.processRefund);

paymentRouter
  .route("/:paymentId/refund/:refundId")
  .patch(auth.authorizeRole("admin"), paymentController.updateRefundStatus);

export default paymentRouter;