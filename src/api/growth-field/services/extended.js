"use strict";

module.exports = ({ strapi }) => ({
  async symbolEnums() {
    const growthField = await strapi.getModel("api::growth-field.growth-field");

    return growthField.attributes.symbol.enum;
  },
});
