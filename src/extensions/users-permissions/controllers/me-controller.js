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
    const { name, lockPassword, lockOption } = body.data;

    const updatedUser = await strapi
      .service("plugin::users-permissions.user")
      .edit(user.id, { name, lockPassword, lockOption });

    ctx.body = await sanitizeOutput(updatedUser, ctx);
  },

  async verifyLockPassword(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { lockPassword } = body.data;

    const verified = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(lockPassword, user.lockPassword);

    return {
      data: {
        verified,
      },
    };
  },
};
