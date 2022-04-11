const axios = require("axios");
const { append } = require("ramda");

module.exports = {
  init(options) {
    const api = axios.create({
      baseURL: options.baseURL || "https://api.ghasedak.me",
      timeout: 5000,
      headers: {
        apikey: options.apiKey,
      },
    });

    return {
      send,
      sendBulk,
      verification,
    };

    async function request({ receptor, body, options, endpoint }) {
      const params = new URLSearchParams();
      params.append("receptor", receptor);
      params.append("message", body);
      optionalParams(param, options.ghasedak);

      const response = await api.post(endpoint, params);
      return response;
    }

    async function send({ receptor, body, options }) {
      return await request({
        receptor,
        body,
        options,
        endpoint: endpoint("simple"),
      });
    }

    async function sendBulk({ receptors, body, options }) {
      if (Array.isArray(receptors)) {
        throw new Error(
          `receptors should be an array, ${typeof receptors} provided`
        );
      }

      if (Array.isArray(body)) {
        return await request({
          receptor,
          body: body.join(","),
          options,
          endpoint: endpoint("bulk"),
        });
      }

      return await request({
        receptor,
        body,
        options,
        endpoint: endpoint("pair"),
      });
    }

    async function verification({ receptor, type, template, checkId, params }) {
      const data = new URLSearchParams();
      data.append(
        "receptor",
        Array.isArray(receptor) ? receptor.join(",") : receptor
      );
      data.append("type", type || 1);
      data.append("template", template);

      Object.keys(params).forEach((key) => {
        data.append(key, params[key]);
      });

      checkId && data.append("checkid", checkId);

      const response = await api.post("v2/verification/send/simple", data);
      return response;
    }

    function optionalParams(params, options) {
      const { sendDate, lineNumber, checkId } = options || {};

      lineNumber && params.append("lineNumber", lineNumber);
      sendDate && params.append("senddate", sendDate);
      checkId && params.append("checkid", checkId);
    }
  },
};

function endpoint(method) {
  return `v2/sms/send/${method}`;
}
