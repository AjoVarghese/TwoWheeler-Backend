const mongoose = require("mongoose");
const moment = require("moment");

const bookingSchema = new mongoose.Schema(
  {
    bikeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: String,
    },
    bookedTimeSlots: {
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
    },
    location: {
      type: String,
    },
    needHelmet: {
      type: Boolean,
    },
    totalHours: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    stripeSessionId: {
      type: String,
    },
    status: {
      type: String,
    },
    bookedAt: {
      type: String,
    },
    paymentType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("Booking", bookingSchema);

module.exports = model;
