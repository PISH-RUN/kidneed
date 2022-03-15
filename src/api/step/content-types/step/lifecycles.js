"use strict";

const utils = require("@strapi/utils");
const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const { month, year } = data;

    const exists = await strapi
      .query("api::step.step")
      .count({ where: { month, year } });

    if (exists) {
      throw new ForbiddenError(
        `Step with provided month(${month}) and year(${year}) already exists.`
      );
    }
  },
};
