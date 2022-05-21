"use strict";

/**
 *  purchase controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::purchase.purchase",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { user } = ctx.state;
      const { params, query } = ctx.request;
      const { id } = params;

      const purchase = await strapi
        .query("api::purchase.purchase")
        .findOne({ where: { uuid: id }, select: ["id"], populate: ["user"] });

      if (!purchase || user.id !== purchase.user?.id) {
        return ctx.badRequest();
      }

      return await strapi
        .service("api::purchase.purchase")
        .findOne(purchase.id, query);
    },
  })
);
