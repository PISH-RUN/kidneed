"use strict";

const couponQuery = () => strapi.query("api::coupon.coupon");
const subscriptionQuery = () => strapi.query("api::subscription.subscription");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::subscription.subscription",
  ({ strapi }) => ({
    async appliedCoupon(ctx) {
      console.log("here");
      const { user } = ctx.state;
      const { body, query } = ctx.request;
      const { coupon: couponCode } = body.data;

      const coupon = await couponQuery().findOne({
        where: { code: couponCode },
        populate: ["user", "onlySubscriptions"],
      });

      if (!strapi.service("api::coupon.extended").isValid(coupon, user)) {
        return ctx.badRequest("Coupon is invalid");
      }

      let subscriptions = await subscriptionQuery().findMany(query);

      subscriptions = subscriptions.map((subscription) => ({
        ...subscription,
        discountPrice: strapi
          .service("api::coupon.extended")
          .offAmount(subscription, coupon),
      }));

      return { data: subscriptions };
    },
  })
);
