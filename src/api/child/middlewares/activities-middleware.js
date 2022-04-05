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

    const childStep = await strapi
      .service("api::child-step.extended")
      .current(childId);

    if (!childStep.field) {
      return ctx.notAcceptable(
        "please first select growth field of your child for this step"
      );
    }

    if (childStep.planGenerated) {
      return next(ctx);
    }

    const now = new Date();
    const child = await strapi.service("api::child.child").findOne(childId);

    await strapi
      .service("api::activity.extended")
      .generate(child, monthRemainingDays(now));

    await strapi.service("api::child-step.extended").generated(childStep);

    return next(ctx);
  };
};
