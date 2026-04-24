const logger = require("../utils/logger");

// Your exact Bingwa bundle prices
const AMOUNT_TO_BUNDLE = {
  // Bingwa Data
  55: { name: "1.25GB", validity: "Till Midnight", category: "Bingwa Data" },
  20: { name: "250MB", validity: "24 Hours", category: "Bingwa Data" },
  19: { name: "1GB", validity: "1 Hour", category: "Bingwa Data" },
  99: { name: "1GB", validity: "24 Hours", category: "Bingwa Data" },
  49: { name: "350MB", validity: "7 Days", category: "Bingwa Data" },
  50: { name: "1.5GB", validity: "3 Hours", category: "Bingwa Data" },
  300: { name: "2.5GB", validity: "7 Days", category: "Bingwa Data" },
  700: { name: "6GB", validity: "7 Days", category: "Bingwa Data" },

  // Tunukiwa
  21: { name: "1GB", validity: "1 Hour", category: "Tunukiwa" },
  52: { name: "1.5GB", validity: "3 Hours", category: "Tunukiwa" },
  110: { name: "2GB", validity: "24 Hours", category: "Tunukiwa" },

  // SMS
  5: { name: "20 SMS", validity: "24 Hours", category: "SMS" },
  10: { name: "250 SMS", validity: "24 Hours", category: "SMS" },
  30: { name: "1000 SMS", validity: "7 Days", category: "SMS" },
  101: { name: "1500 SMS", validity: "30 Days", category: "SMS" },
  201: { name: "3500 SMS", validity: "7 Days", category: "SMS" },

  // Minutes
  22: { name: "43 Mins", validity: "3 Hours", category: "Minutes" },
  51: { name: "50 Mins", validity: "Till Midnight", category: "Minutes" },
  100: { name: "100 Mins", validity: "2 Days", category: "Minutes" },
  199: { name: "250 Mins", validity: "7 Days", category: "Minutes" },
};

// No aggregator needed — Safaricom delivers Bingwa bundle automatically
// when customer pays the till. We just log it.
const logDelivery = (order) => {
  const bundle = AMOUNT_TO_BUNDLE[order.amount];

  if (!bundle) {
    logger.warn(`Unknown bundle amount KES ${order.amount} — logged anyway`);
    return { name: "Unknown", validity: "Unknown", category: "Unknown" };
  }

  logger.info(
    `Bundle logged — ${bundle.category}: ${bundle.name} (${bundle.validity}) → ${order.phone}`,
  );
  return bundle;
};

module.exports = { logDelivery, AMOUNT_TO_BUNDLE };
