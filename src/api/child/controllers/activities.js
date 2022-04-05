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

    const result = await strapi.controller("api::activity.activity").find(ctx);

    const ids = result.data.map((data) => data.id);
    const contents = await strapi
      .service("api::activity.extended")
      .contentsInfo(ids, ["title"]);

    result.data = result.data.map((data) =>
      merge(data, {
        attributes: {
          title: contents[data.id].title,
        },
      })
    );

    return result;
  },
};
