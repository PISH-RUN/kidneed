"use strict";

module.exports = ({ strapi }) => ({
  async createPayment(purchase) {
    purchase = await strapi
      .service("api::purchase.extended")
      .update(purchase.id);

    const amount = purchase.price;

    if (amount < 1000) {
      return [amount, null];
    }

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

      return [amount, payment];
    } catch (e) {
      console.error(e.message);
      console.log(e);
    }

    return [];
  },

  async verify(authority) {
    const payment = await strapi.query("api::payment.payment").findOne({
      where: { authority },
      populate: [
        "purchase",
        "purchase.user",
        "purchase.subscription",
        "purchase.coupon",
      ],
    });

    if (!payment) {
      throw new Error(`No Payment found`);
    }

    if (payment.refId) {
      return payment.purchase;
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

    if (data.code === 101 && payment.purchase.status === "completed") {
      return payment.purchase;
    }

    if (data.code === 100 || data.code === 101) {
      const now = new Date();

      await strapi.service("api::payment.payment").update(payment.id, {
        data: { refId: data.ref_id.toString(), completedAt: now },
      });

      return await strapi
        .service("api::purchase.extended")
        .succeed(payment.purchase);
    }
  },
});
