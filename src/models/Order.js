const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    bundle: { type: String, required: true },
    amount: { type: Number, required: true },
    network: { type: String, default: "Safaricom" },
    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "delivery_failed", "failed"],
      default: "pending",
    },
    mpesaReceiptNumber: { type: String },
    checkoutRequestId: { type: String },
    deliveryRef: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
