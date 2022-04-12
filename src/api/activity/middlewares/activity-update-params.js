"use strict";

const pick = require("lodash/pick");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { body } = ctx.request;

    ctx.request.body.data = pick(body.data, ["content", "duration"]);

    await next();
  };
};
