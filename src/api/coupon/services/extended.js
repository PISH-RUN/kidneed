"use strict";

const isPast = require("date-fns/isPast");

module.exports = ({ strapi }) => ({
  isValid(coupon, user) {
    if (!coupon) {
      return false;
    }

    if (coupon.user && coupon.user.id !== user.id) {
      return false;
    }

    if (coupon.capacity <= coupon.used) {
      return false;
    }

    if (coupon.expiresAt && isPast(parse(coupon.expiresAt))) {
      return false;
    }

    return true;
  },

  offAmount(price, coupon) {
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
