import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    specialRequests: {
      type: String,
    },
    contactInformation: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    participants: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
        },
        gender: {
          type: String,
          enum: ["male", "female", "other", "prefer not to say"],
        },
        idType: {
          type: String,
          enum: ["passport", "driving license", "aadhar", "voter id", "other"],
        },
        idNumber: {
          type: String,
        },
      },
    ],
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

// Generate a unique booking reference number
bookingSchema.pre("save", async function (next) {
  if (!this.bookingReference) {
    const prefix = "EE"; // ExploreEase prefix
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.bookingReference = `${prefix}${timestamp}${random}`;
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;