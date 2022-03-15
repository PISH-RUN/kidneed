"use strict";

var getYear = require("date-fns-jalali/getYear");
var getMonth = require("date-fns-jalali/getMonth");

module.exports = ({ strapi }) => ({
  async current() {
    const now = new Date();
    const [month, year] = [getMonth(now), getYear(now)];

    const steps = await strapi
      .query("api::step.step")
      .findMany({ where: { month, year } });

    if (steps.length > 0) {
      return steps[0];
    }

    return await strapi
      .query("api::step.step")
      .create({ data: { month, year } });
  },
});
