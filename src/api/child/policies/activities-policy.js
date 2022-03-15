"use strict";
const getProp = require("lodash/get");

module.exports = async (ctx, config, { strapi }) => {
  const { params } = ctx.request;
  const { id: childId } = params;
  const { id: userId } = ctx.state.user;

  const child = await strapi.query("api::child.child").findOne({
    where: {
      id: childId,
    },
    populate: {
      user: true,
    },
  });

  return child.user.id === userId;
};
