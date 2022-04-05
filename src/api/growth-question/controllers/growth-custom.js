"use strict";

const merge = require("lodash/merge");

async function findGrowthQuestion(ctx, field, fieldsCount) {
  const total = await strapi
    .query("api::growth-question.growth-question")
    .count({ where: { field } });

  const query = {
    filters: { field: { $eq: field } },
    pagination: { pageSize: Math.ceil(total / fieldsCount) },
  };

  const extendedCtx = { request: { query } };

  const response = await strapi
    .controller("api::growth-question.growth-question")
    .find(merge(ctx, extendedCtx));

  return response.data;
}

module.exports = {
  async system(ctx) {
    const fields = await strapi
      .service("api::growth-question.extended")
      .fieldsEnum();

    const result = await fields.reduce(async (acc, curr) => {
      return [
        ...(await acc),
        ...(await findGrowthQuestion(ctx, curr, fields.length)),
      ];
    }, Promise.resolve([]));

    return {
      data: result,
    };
  },
};
