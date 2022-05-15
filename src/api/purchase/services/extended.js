"use strict";

const pService = (strapi) => strapi.service("api::purchase.purchase");

module.exports = ({ strapi }) => ({
  async update(purchaseId) {
    let purchase = await pService(strapi).findOne(purchaseId, {
      populate: "*",
    });

    const { coupon, user, subscription } = purchase;

    if (strapi.service("api::coupon.extended").isValid(coupon, user)) {
      const price = strapi
        .service("api::coupon.extended")
        .offAmount(subscription.currentPrice, coupon);

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
});
