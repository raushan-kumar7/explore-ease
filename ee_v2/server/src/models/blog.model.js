import mongoose, { Schema } from "mongoose";
import slug from "slugify";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1739528025/Tours/blog-default-image_ihqhmd.jpg",
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.title) {
    this.slug = slug(this.title, { lower: true, strict: true });
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;