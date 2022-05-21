module.exports = ({ env }) => ({
  merchantId: env("ZARINPAL_MERCHANT_ID"),
  baseUrl: "https://api.zarinpal.com/pg/v4",
  callback: env("ZARINPAL_CALLBACK"),
});
