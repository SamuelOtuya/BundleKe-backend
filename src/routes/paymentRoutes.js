const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  mpesaCallback,
} = require("../controllers/paymentController");

router.post("/stk-push", initiatePayment);
router.post("/callback", mpesaCallback);

module.exports = router;
