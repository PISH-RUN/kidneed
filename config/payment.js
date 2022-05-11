module.exports = ({ env }) => ({
  success: env("PAYMENT_SUCCESS_REDIRECT"),
  failed: env("PAYMENT_FAILED_REDIRECT"),
});
