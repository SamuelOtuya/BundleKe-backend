const express = require("express");
const router = express.Router();
const {
  getOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.get("/:id", getOrderStatus);

module.exports = router;
