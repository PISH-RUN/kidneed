const axios = require("axios");

module.exports = ({ strapi }) => {
  const { merchantId, callback, baseUrl } = strapi.config.get("zarinpal");

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  async function request(amount, description, metadata = {}) {
    const response = await axiosInstance.post("payment/request.json", {
      merchant_id: merchantId,
      amount,
      description,
      callback_url: callback,
      metadata,
    });

    return response;
  }

  async function verify(amount, authority) {
    return { data: { data: { ref_id: 123, code: 100 } } };
    const response = await axiosInstance.post("payment/verify.json", {
      merchant_id: merchantId,
      amount,
      authority,
    });

    return response;
  }

  return {
    request,
    verify,
  };
};
