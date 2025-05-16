// import { Router } from "express";
// import { auth, multerMiddleware } from "../middlewares/index.js";
// import { messageController } from "../controllers/index.js";

// const msgRouter = Router();

// msgRouter.use(auth.authenticate);

// msgRouter
//   .route("/chat/:chatId")
//   .get(messageController.getMessages)
//   .post(
//     multerMiddleware.msgAttachmentUpload.single("attachments"),
//     messageController.sendMessage
//   );
// msgRouter.route("/:messageId").delete(messageController.deleteMessage);
// msgRouter.route("/chat/:chatId/read").patch(messageController.markChatAsRead);
// msgRouter.route("/unread").get(messageController.getUnreadMessageCount);

// export default msgRouter;


import { Router } from "express";
import { auth, multerMiddleware } from "../middlewares/index.js";
import { messageController } from "../controllers/index.js";

const msgRouter = Router();

msgRouter.use(auth.authenticate);

msgRouter
  .route("/chat/:chatId")
  .get(messageController.getMessages)
  .post(
    multerMiddleware.msgAttachmentUpload.array("attachments"), // Changed from single to array
    messageController.sendMessage
  );
msgRouter.route("/:messageId").delete(messageController.deleteMessage);
msgRouter.route("/chat/:chatId/read").patch(messageController.markChatAsRead);
msgRouter.route("/unread").get(messageController.getUnreadMessageCount);

export default msgRouter;