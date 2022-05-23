"use strict";

const isPast = require("date-fns/isPast");

module.exports = ({ strapi }) => ({
  async isValid(coupon, user) {
    if (!coupon) {
      return false;
    }

    if (coupon.user && coupon.user.id !== user.id) {
      return false;
    }

    if (coupon.capacity <= coupon.used) {
      return false;
    }

    if (coupon.expiresAt && isPast(new Date(coupon.expiresAt))) {
      return false;
    }

    if (coupon.perUser !== null) {
      const used = await strapi.query("api::purchase.purchase").count({
        where: {
          $and: [{ user: user.id, coupon: coupon.id, status: "completed" }],
        },
      });
      if (used >= coupon.perUser) {
        return false;
      }
    }

    return true;
  },

  offAmount(subscription, coupon) {
    const { currentPrice: price } = subscription;

    if (!coupon) {
      return price;
    }

    const { amount, percent } = coupon;

    if (amount) {
      return Math.max(price - amount, 0);
    }

    if (percent) {
      return Math.max((price * (100 - percent)) / 100, 0);
    }

    return price;
  },
});
