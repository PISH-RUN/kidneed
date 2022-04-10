"use strict";

const ageSchema = require("./validations/age");

module.exports = ({ strapi }) => ({
  async fromCSV(records) {
    await records.reduce(async (acc, record) => {
      await acc;
      return processRecord(record);
    }, Promise.resolve());

    async function processRecord(record) {
      await ageSchema.validate(record);

      const { min, max, slug, description } = record;
      const age = await strapi
        .query("api::age-group.age-group")
        .findOne({ where: { slug } });

      if (age) {
        return;
      }

      await strapi
        .service("api::age-group.age-group")
        .create({ data: { min, max, slug, description } });
    }
  },
});
