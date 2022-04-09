"use strict";

const quizSchema = require("./validations/quiz");

module.exports = ({ strapi }) => ({
  async fromCSV(records) {
    const validationSchema = await quizSchema(strapi);

    let quiz;

    await records.reduce(async (acc, record, index) => {
      await acc;
      return processRecord(record, index);
    }, Promise.resolve());

    async function processRecord(record, index) {
      await validationSchema(index).validate(record);

      const { question, subfield, age, name, type } = record;
      const growthSubfield = await strapi
        .query("api::growth-subfield.growth-subfield")
        .findOne({ where: { name: subfield } });

      if (!quiz) {
        const ageGroup = await strapi
          .query("api::age-group.age-group")
          .findOne({ where: { slug: age } });

        quiz = await strapi.service("api::quiz.quiz").create({
          data: {
            name,
            type,
            ageGroup: ageGroup.id,
            growthSubfield: type ? null : growthSubfield.id,
          },
        });
      }

      await strapi
        .service("api::question.question")
        .create({
          data: {
            body: question,
            quiz: quiz.id,
            growthSubfield: growthSubfield.id,
          },
        });
    }
  },
});
