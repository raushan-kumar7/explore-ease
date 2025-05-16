import { Router } from "express";
import { userController } from "../controllers/index.js";
import { auth, multerMiddleware } from "../middlewares/index.js";

const userRouter = Router();

userRouter.use(auth.authenticate);

userRouter.route("/profile").get(userController.getUserProfile);
userRouter.route("/profile").put(userController.updateUserProfile);
userRouter
  .route("/avatar")
  .patch(
    multerMiddleware.usrImgUpload.single("avatar"),
    userController.updateUserProfileAvatar
  );
userRouter.route("/delete-account").delete(userController.deleteUserProfile);

export default userRouter;