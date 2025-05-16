import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: function () {
        return this.attachements.length === 0;
      },
    },
    attachments: [
      {
        type: String,
        validate: {
          validator: function (url) {
            return (
              url.includes("cloudinary.com") ||
              url.includes("your-storage-domain.com")
            );
          },
          message: "Invalid attachment URL",
        },
      },
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        if (ret.isDeleted) {
          ret.content = "This message has been deleted";
          ret.attachements = [];
        }
        return ret;
      },
    },
  }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ readBy: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;