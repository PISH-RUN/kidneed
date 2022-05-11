"use strict";

const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");

module.exports = ({ strapi }) => ({
  async createPayment(purchase) {
    const amount = purchase.price;

    try {
      const response = await strapi.zarinpal.request(
        amount,
        purchase.subscription.name,
        {
          mobile: purchase.user.mobile,
        }
      );

      const { authority, fee } = response.data.data;

      const payment = await strapi.service("api::payment.payment").create({
        data: {
          type: "online",
          gateway: "zarinpal",
          amount,
          authority,
          fee,
          purchase: purchase.id,
        },
      });

      return payment;
    } catch (e) {
      console.error(e.message);
      console.log(e);
    }

    return null;
  },

  async verify(authority) {
    const payment = await strapi.query("api::payment.payment").findOne({
      where: { authority },
      populate: ["purchase", "purchase.user", "purchase.subscription"],
    });

    if (!payment) {
      throw new Error(`No Payment found`);
    }

    if (payment.refId) {
      throw new Error(`Payment has been completed`);
    }

    let response;
    try {
      response = await strapi.zarinpal.verify(
        payment.amount,
        payment.authority
      );
    } catch (e) {
      throw new Error(e.response?.data.errors.message);
    }

    const { data } = response.data;

    if (data.code === 101) {
      return payment;
    }

    if (data.code === 100) {
      const role = await strapi
        .service("plugin::users-permissions.extended")
        .subscribedRole();
      const { purchase } = payment;
      const { user, subscription } = purchase;
      const now = new Date();

      await strapi.service("api::payment.payment").update(payment.id, {
        data: { refId: data.ref_id.toString(), completedAt: now },
      });

      await strapi
        .service("api::purchase.purchase")
        .update(purchase.id, { data: { status: "completed" } });

      let subscribeTime = user.subscribedUntil
        ? new Date(user.subscribedUntil)
        : now;
      if (subscription.days) {
        subscribeTime = addDays(subscribeTime, subscription.days);
      }

      if (subscription.months) {
        subscribeTime = addMonths(subscribeTime, subscription.months);
      }

      await strapi.service("plugin::users-permissions.user").edit(user.id, {
        subscribedUntil: subscribeTime,
        role: role.id,
      });

      return purchase;
    }

    throw new Error(`Something went wrong`);
  },
});
