import { Router } from "express";
import { authController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

const authRouter = Router();

// PUBLIC routes
authRouter.route("/signup").post(authController.signup);
authRouter.route("/signin").post(authController.signin);
authRouter.route("/refresh-token").post(authController.refreshAccessToken);
authRouter.route("/forgot-password").post(authController.forgotPassword);
authRouter.route("/reset-password").patch(authController.resetPassword);


authRouter.use(auth.authenticate);

// PROTECTED ROUTES (require authentication)
authRouter.route("/signout").post(authController.signout);
authRouter.route("/change-password").patch(authController.changePassword);
authRouter.route("/me").get(authController.currentUser);

export default authRouter;