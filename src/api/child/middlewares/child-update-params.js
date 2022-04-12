"use strict";

const pick = require("lodash/pick");
var getYear = require("date-fns-jalali/getYear");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { body } = ctx.request;
    const { age } = body.data;

    ctx.request.body.data = pick(body.data, ["name", "gender", "relation"]);

    if (age && age >= 3 && age <= 11) {
      ctx.request.body.data.birthYear = getYear(new Date()) - Math.round(age);
    }

    await next();
  };
};
