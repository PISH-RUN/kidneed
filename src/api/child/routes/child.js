"use strict";

/**
 * child router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::child.child", {
  config: {
    update: {
      middlewares: ["api::child.child-update-params"],
      policies: ["global::child-owner"],
    },
  },
});
