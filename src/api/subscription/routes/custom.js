"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/coupon-subscriptions",
      handler: "subscription.appliedCoupon",
    },
  ],
};
