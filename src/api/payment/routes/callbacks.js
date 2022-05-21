"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/payment-callback/zarinpal",
      handler: "zarinpal.callback",
    },
  ],
};
