"use strict";

const couponQuery = () => strapi.query("api::coupon.coupon");
const subscriptionQuery = () => strapi.query("api::subscription.subscription");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::subscription.subscription",
  ({ strapi }) => ({
    async appliedCoupon(ctx) {
      const { user } = ctx.state;
      const { body, query } = ctx.request;
      const { coupon: couponCode } = body.data;

      const coupon = await couponQuery().findOne({
        where: { code: couponCode },
        populate: ["user", "onlySubscriptions"],
      });

      if (
        !(await strapi.service("api::coupon.extended").isValid(coupon, user))
      ) {
        return ctx.badRequest("Coupon is invalid");
      }

      let subscriptions = await subscriptionQuery().findMany(query);

      const { onlySubscriptions } = coupon;

      subscriptions = subscriptions.map((subscription) => ({
        ...subscription,
        discountPrice:
          onlySubscriptions.length > 0 &&
          !onlySubscriptions.find((s) => s.id === subscription.id)
            ? subscription.currentPrice
            : strapi
                .service("api::coupon.extended")
                .offAmount(subscription, coupon),
      }));

      return { data: subscriptions };
    },
  })
);
