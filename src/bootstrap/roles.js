"use strict";

module.exports = ({ strapi }) => ({
  async run() {
    const subscribed = await strapi
      .service("plugin::users-permissions.extended")
      .subscribedRole();

    if (subscribed) {
      return;
    }

    await strapi
      .service("plugin::users-permissions.role")
      .createRole({ name: "Subscribed", description: "Subscribed Users" });
  },
});
