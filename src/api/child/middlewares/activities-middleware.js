"use strict";

var getDate = require("date-fns-jalali/getDate");
var getDaysInMonth = require("date-fns-jalali/getDaysInMonth");

const monthRemainingDays = (date) => {
  const dayOfMonth = getDate(date);
  const totalMonthDays = getDaysInMonth(date);

  return totalMonthDays - dayOfMonth + 1;
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { params } = ctx.request;
    const { id: childId } = params;

    const step = await strapi.service("api::step.extended").current();
    const didGenerated = await strapi
      .service("api::child-step.extended")
      .exists(step.id, childId);

    if (didGenerated) {
      return next(ctx);
    }

    const now = new Date();
    const child = await strapi.query("api::child.child").findOne(childId);

    await strapi
      .service("api::activity.extended")
      .generate(child, monthRemainingDays(now));

    await strapi.service("api::child-step.extended").generate(step.id, childId);
  };
};
