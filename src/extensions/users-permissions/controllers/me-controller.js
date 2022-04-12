"use strict";

const utils = require("@strapi/utils");
const { sanitize } = utils;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = {
  async update(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { name } = body.data;

    const updatedUser = await strapi
      .query("plugin::users-permissions.user")
      .update({ where: { id: user.id }, data: { name } });

    ctx.body = await sanitizeOutput(updatedUser, ctx);
  },
};
