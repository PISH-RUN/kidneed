"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::notification.notification",
  ({ strapi }) => ({
    async readAll(ctx) {
      const { user } = ctx.state;

      const result = await strapi
        .service("api::notification.extended")
        .readAll(user.id);

      return { ok: true, read: result.count };
    },
  })
);
