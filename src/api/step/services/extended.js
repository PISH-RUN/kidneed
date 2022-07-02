"use strict";

var getYear = require("date-fns-jalali/getYear");
var getMonth = require("date-fns-jalali/getMonth");

module.exports = ({ strapi }) => ({
  async get(month, year) {
    const now = new Date();

    if (!month) {
      month = getMonth(now);
    }

    if (!year) {
      year = getYear(now);
    }

    const step = await strapi
      .query("api::step.step")
      .findOne({ where: { month, year } });

    if (step) {
      return step;
    }

    return await strapi
      .query("api::step.step")
      .create({ data: { month, year } });
  },

  async current() {
    return this.get();
  },
});
