"use strict";

const getYear = require("date-fns-jalali/getYear");

module.exports = ({ strapi }) => ({
  async attachUser(childId, userId) {
    return await strapi.service("api::child.child").update(childId, {
      data: { user: userId },
    });
  },
  age(child) {
    const { birthYear } = child;
    return getYear(new Date()) - birthYear;
  },
});
