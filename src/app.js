const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(helmet());

// Allow all origins for now — restrict after going live
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
