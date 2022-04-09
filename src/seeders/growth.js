"use strict";

const growthSchema = require("./validations/growth");

module.exports = ({ strapi }) => ({
  async fromCSV(records) {
    const allowedEnums = await strapi
      .service("api::growth-field.extended")
      .symbolEnums();

    const growthFields = {};
    await records.reduce(async (acc, record) => {
      await acc;
      return processRecord(record);
    }, Promise.resolve());

    async function processRecord(record) {
      await growthSchema(allowedEnums).validate(record);

      const { field, subfield, symbol, number } = record;

      if (!growthFields[field]) {
        let growthField = await strapi
          .query("api::growth-field.growth-field")
          .findOne({ where: { name: field } });

        if (!growthField) {
          growthField = await strapi
            .service("api::growth-field.growth-field")
            .create({ data: { name: field, symbol } });
        }

        growthFields[field] = growthField;
      }

      let growthSubfield = await strapi
        .query("api::growth-subfield.growth-subfield")
        .findOne({
          where: { name: subfield, growthField: growthFields[field].id },
        });

      if (growthSubfield) {
        return;
      }

      growthSubfield = await strapi
        .service("api::growth-subfield.growth-subfield")
        .create({
          data: {
            name: subfield,
            growthField: growthFields[field].id,
            number,
          },
        });
    }
  },
});
