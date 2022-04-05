"use strict";

/**
 *  growth-question controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::growth-question.growth-question",
  ({ strapi }) => ({
    async find(ctx) {
      if (ctx.query.filters?.field?.$eq === "system") {
        return await strapi
          .controller("api::growth-question.growth-custom")
          .system(ctx);
      }

      return await super.find(ctx);
    },
  })
);
