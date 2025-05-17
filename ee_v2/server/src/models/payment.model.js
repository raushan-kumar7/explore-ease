import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "cash"],
      required: true,
    },
    upiDetails: {
      upiId: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      appUsed: {
        type: String,
        enum: ["google-pay", "phonepe", "paytm", "amazon-pay", "bhim", "other"],
      },
    },
    cardDetails: {
      last4: {
        type: String,
      },
      cardType: {
        type: String,
        enum: ["credit", "debit"],
      },
      bank: {
        type: String,
      },
    },
    transactionId: {
      type: String,
      unique: true,
    },
    referenceId: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "initiated",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "initiated",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    receipt: {
      type: String, // URL or file path to payment receipt
    },
    metadata: {
      type: Object, // For any additional payment processor data
    },
    refunds: [
      {
        amount: {
          type: Number,
        },
        reason: {
          type: String,
        },
        status: {
          type: String,
          enum: ["initiated", "processing", "completed", "failed"],
        },
        refundDate: {
          type: Date,
          default: Date.now,
        },
        refundId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Generate transaction ID
paymentSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const prefix = "EETXN";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.transactionId = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Hook for updating booking status after payment status changes
paymentSchema.post("save", async function () {
  try {
    const booking = await mongoose.model("Booking").findById(this.booking);
    if (booking) {
      if (this.status === "completed") {
        booking.status = "confirmed";
      } else if (this.status === "failed") {
        booking.status = "pending";
      } else if (this.status === "refunded") {
        booking.status = "cancelled";
      }
      await booking.save();
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
  }
});

// Virtual field to get refund total
paymentSchema.virtual("totalRefunded").get(function () {
  return this.refunds.reduce((total, refund) => {
    if (refund.status === "completed") {
      return total + refund.amount;
    }
    return total;
  }, 0);
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;