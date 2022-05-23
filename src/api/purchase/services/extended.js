"use strict";

const pService = (strapi) => strapi.service("api::purchase.purchase");

const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const isPast = require("date-fns/isPast");

module.exports = ({ strapi }) => ({
  async update(purchaseId) {
    let purchase = await pService(strapi).findOne(purchaseId, {
      populate: "*",
    });

    const { coupon, user, subscription } = purchase;

    if (await strapi.service("api::coupon.extended").isValid(coupon, user)) {
      const price = strapi
        .service("api::coupon.extended")
        .offAmount(subscription, coupon);

      if (price !== purchase.price) {
        purchase = pService(strapi).update(purchase.id, {
          data: { price },
          populate: "*",
        });
      }

      return purchase;
    }

    purchase = pService(strapi).update(purchase.id, {
      data: { coupon: null, price: subscription.currentPrice },
      populate: "*",
    });

    return purchase;
  },

  async succeed(purchase) {
    const role = await strapi
      .service("plugin::users-permissions.extended")
      .subscribedRole();

    purchase = await strapi
      .service("api::purchase.purchase")
      .findOne(purchase.id, { populate: ["user", "subscription", "coupon"] });

    const { user, subscription, coupon } = purchase;
    const now = new Date();

    let subscribeTime = user.subscribedUntil
      ? new Date(user.subscribedUntil)
      : now;

    if (isPast(subscribeTime)) {
      subscribeTime = now;
    }

    if (subscription.days) {
      subscribeTime = addDays(subscribeTime, subscription.days);
    }

    if (subscription.months) {
      subscribeTime = addMonths(subscribeTime, subscription.months);
    }

    await strapi
      .service("api::purchase.purchase")
      .update(purchase.id, { data: { status: "completed" } });

    await strapi.service("plugin::users-permissions.user").edit(user.id, {
      subscribedUntil: subscribeTime,
      role: role.id,
    });

    if (coupon) {
      await strapi
        .service("api::coupon.coupon")
        .update(coupon.id, { data: { used: coupon.used + 1 } });
    }

    return purchase;
  },
});
