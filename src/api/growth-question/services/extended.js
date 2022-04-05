"use strict";

module.exports = ({ strapi }) => ({
  async fieldsEnum() {
    const growthQuestion = await strapi.getModel(
      "api::growth-question.growth-question"
    );

    return growthQuestion.attributes.field.enum;
  },
});
