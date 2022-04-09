"use strict";

const { ageFromJBirthYear } = require("../../../utils/calc");

module.exports = ({ strapi }) => ({
  async get(child) {
    const age = ageFromJBirthYear(child.birthYear);

    return await strapi
      .query("api::age-group.age-group")
      .findOne({ where: { min: { $lte: age }, max: { $gte: age } } });
  },
});
