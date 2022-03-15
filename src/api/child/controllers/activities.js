"use strict";

const merge = require("lodash/merge");

module.exports = {
  async find(ctx) {
    const { params, query } = ctx.request;
    const { id: childId } = params;

    const newQuery = merge(query, {
      filters: { child: Number(childId) },
    });

    ctx.request.query = newQuery;

    return await strapi.controller("api::activity.activity").find(ctx);
  },
};
