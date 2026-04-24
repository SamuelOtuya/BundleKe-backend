const mpesaService = require("../services/mpesaService");
const bundleService = require("../services/bundleService");
const Order = require("../models/Order");
const logger = require("../utils/logger");

const initiatePayment = async (req, res) => {
  const { phone, amount, bundle, network } = req.body;

  console.log("Incoming request body:", req.body);

  try {
    const order = await Order.create({ phone, amount, bundle, network });

    const mpesaRes = await mpesaService.stkPush({
      phone,
      amount,
      orderId: order._id.toString(),
    });

    order.checkoutRequestId = mpesaRes.CheckoutRequestID;
    await order.save();

    res.status(200).json({
      message: "STK Push sent. Enter M-Pesa PIN on your phone.",
      orderId: order._id,
      checkoutRequestId: mpesaRes.CheckoutRequestID,
    });
  } catch (err) {
    console.error("Full error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    res.status(500).json({
      message: "Payment initiation failed",
      error: err.response?.data || err.message,
    });
  }
};

const mpesaCallback = async (req, res) => {
  const callbackData = req.body?.Body?.stkCallback;
  if (!callbackData)
    return res.status(400).json({ message: "Invalid callback" });

  const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } =
    callbackData;

  console.log("Callback received:", {
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
  });

  try {
    const order = await Order.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (ResultCode === 0) {
      const receipt = CallbackMetadata.Item.find(
        (i) => i.Name === "MpesaReceiptNumber",
      );
      const amount = CallbackMetadata.Item.find((i) => i.Name === "Amount");
      const phone = CallbackMetadata.Item.find((i) => i.Name === "PhoneNumber");

      order.mpesaReceiptNumber = receipt?.Value;
      order.amount = amount?.Value;
      order.status = "paid";
      await order.save();

      // Log the bundle — Safaricom delivers it automatically via Bingwa
      const bundle = bundleService.logDelivery(order);
      order.status = "delivered";
      order.bundle = `${bundle.category}: ${bundle.name} (${bundle.validity})`;
      await order.save();

      logger.info(
        `✅ Order ${order._id} — KES ${order.amount} paid by ${order.phone}`,
      );
    } else {
      order.status = "failed";
      await order.save();
      logger.warn(`Payment failed — order ${order._id} — ${ResultDesc}`);
    }

    res.status(200).json({ message: "Callback received" });
  } catch (err) {
    logger.error("Callback error: " + err.message);
    res.status(500).json({ message: "Callback error" });
  }
};

module.exports = { initiatePayment, mpesaCallback };
