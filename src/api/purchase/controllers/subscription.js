"use strict";

const pick = require("lodash/pick");
const crypto = require("crypto");

const parseDate = require("date-fns/parse");
const isPast = require("date-fns/isPast");

const purchaseQuery = () => strapi.query("api::purchase.purchase");
const purchaseService = () => strapi.service("api::purchase.purchase");
const couponQuery = () => strapi.query("api::coupon.coupon");
const subscriptionService = () =>
  strapi.service("api::subscription.subscription");

function getPrice(price, coupon) {
  const { amount, percent } = coupon;

  if (amount) {
    return Math.max(price - amount, 0);
  }

  if (percent) {
    return Math.max((price * (100 - percent)) / 100, 0);
  }

  return price;
}

module.exports = {
  async purchase(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { subscription: subscriptionId, coupon: couponCode } = body.data;

    const subscription = await subscriptionService().findOne(subscriptionId);

    if (!subscription) {
      return ctx.badRequest();
    }

    let purchase = await strapi.service("api::purchase.purchase").create({
      data: {
        subscription: subscription.id,
        user: user.id,
        price: subscription.currentPrice,
        uuid: crypto.randomUUID(),
      },
      populate: ["subscription"],
    });

    const coupon = await couponQuery().findOne({
      where: { code: couponCode },
      populate: ["user", "onlySubscriptions"],
    });

    if (!strapi.service("api::coupon.extended").isValid(coupon, user)) {
      return { data: pick(purchase, "uuid", "price", "subscription") };
    }

    const { onlySubscriptions } = coupon;

    if (
      onlySubscriptions.length > 0 &&
      !onlySubscriptions.find((s) => s.id === subscription.id)
    ) {
      return { data: pick(purchase, "uuid", "price", "subscription") };
    }

    purchase = await purchaseService().update(purchase.id, {
      data: {
        coupon: coupon.id,
        price: strapi
          .service("api::coupon.extended")
          .offAmount(purchase.subscription, coupon),
      },
      populate: ["subscription", "coupon"],
    });

    return {
      data: pick(
        purchase,
        "uuid",
        "price",
        "subscription",
        "coupon.code",
        "coupon.amount",
        "coupon.percent"
      ),
    };
  },

  async coupon(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { purchase: purchaseUUID, coupon: couponCode } = body.data;

    let purchase = await purchaseQuery().findOne({
      where: { uuid: purchaseUUID },
      populate: ["subscription", "user"],
    });

    if (!purchase || purchase.user.id !== user.id) {
      return ctx.badRequest();
    }

    const coupon = await couponQuery().findOne({
      where: { code: couponCode },
      populate: ["user", "onlySubscriptions"],
    });

    const { onlySubscriptions } = coupon;

    if (
      !strapi.service("api::coupon.extended").isValid(coupon, user) ||
      (onlySubscriptions.length > 0 &&
        !onlySubscriptions.find((s) => s.id === subscription.id))
    ) {
      return ctx.badRequest("Coupon is invalid");
    }

    purchase = await purchaseService().update(purchase.id, {
      data: {
        coupon: coupon.id,
        price: strapi
          .service("api::coupon.extended")
          .offAmount(purchase.subscription, coupon),
      },
      populate: ["subscription", "coupon"],
    });

    return {
      data: pick(
        purchase,
        "uuid",
        "price",
        "subscription",
        "coupon.code",
        "coupon.amount"
      ),
    };
  },

  async payment(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { purchase: purchaseUUID } = body.data;

    let purchase = await purchaseQuery().findOne({
      where: { uuid: purchaseUUID },
      populate: ["subscription", "user", "payment"],
    });

    if (
      !purchase ||
      purchase.status === "completed" ||
      purchase.user.id !== user.id ||
      purchase.payment?.refId
    ) {
      return ctx.badRequest();
    }

    if (purchase.payment) {
      await strapi.service("api::payment.payment").delete(purchase.payment.id);
    }

    const [amount, payment] = await strapi
      .service("api::payment.zarinpal")
      .createPayment(purchase);

    if (amount !== undefined && !payment) {
      await strapi.service("api::purchase.extended").succeed(purchase);
      const successRedirect = strapi.config.get(
        "payment.success",
        "https://yekodo.ir"
      );

      return {
        data: {
          url: successRedirect + `?purchase=${purchase.uuid}`,
        },
      };
    }

    if (!payment) {
      return ctx.badRequest(`Something went wrong, please try again later`);
    }

    await strapi
      .service("api::purchase.purchase")
      .update(purchase.id, { data: { status: "waitingForPayment" } });

    return {
      data: {
        url: `https://zarinpal.com/pg/StartPay/${payment.authority}`,
      },
    };
  },
};
