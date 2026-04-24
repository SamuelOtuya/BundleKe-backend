const axios = require("axios");
const config = require("../config/mpesa");

const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`,
  ).toString("base64");

  const res = await axios.get(
    `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } },
  );
  return res.data.access_token;
};

const stkPush = async ({ phone, amount, orderId }) => {
  try {
    const token = await getAccessToken();

    const now = new Date();
    const eat = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timestamp = eat
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${config.shortcode}${config.passkey}${timestamp}`,
    ).toString("base64");

    const payload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      // TransactionType: "CustomerBuyGoodsOnline",
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: orderId,
      TransactionDesc: "Bundle Purchase",
    };

    console.log("STK payload:", JSON.stringify(payload, null, 2));

    const res = await axios.post(
      `${config.baseUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    console.log("Safaricom response:", res.data);
    return res.data;
  } catch (err) {
    console.error("STK error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { stkPush, getAccessToken };
