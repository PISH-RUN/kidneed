"use strict";

module.exports = ({ strapi }) => ({
  async findRole(name) {
    const roles = await strapi
      .service("plugin::users-permissions.role")
      .getRoles();

    return roles.find((role) => role.name.toLowerCase() === name);
  },
  async subscribedRole() {
    return await this.findRole("subscribed");
  },
  async authenticatedRole() {
    return await this.findRole("authenticated");
  },
});
