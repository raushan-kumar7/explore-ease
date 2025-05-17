import mongoose, { Schema } from "mongoose";
import slug from "slugify";

const tourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1740676492/ExploreEase/travelbadge_llbyae.jpg",
        "https://res.cloudinary.com/cloud-alpha/image/upload/v1740676491/ExploreEase/map-nav_fucdyc.jpg",
      ],
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tourSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slug(this.title, { lower: true, strict: true });
  }
  next();
});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;