"use strict";

const merge = require("lodash/merge");

const nController = () => strapi.controller("api::notification.notification");

module.exports = {
  async find(ctx) {
    const { user } = ctx.state;
    const { query } = ctx.request;

    ctx.request.query = merge(query, { filters: { user: user.id } });

    return await nController().find(ctx);
  },
};
