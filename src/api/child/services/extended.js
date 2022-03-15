"use strict";

module.exports = ({ strapi }) => ({
  async attachUser(childId, userId) {
    return await strapi.service("api::child.child").update(childId, {
      data: { user: userId },
    });
  },
});
