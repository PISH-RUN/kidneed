"use strict";

/**
 * activity router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::activity.activity", {
  config: {
    update: {
      middlewares: ["api::activity.activity-update-params"],
      policies: ["activity-owner"],
    },
    delete: {
      policies: ["activity-owner"],
    },
  },
});
