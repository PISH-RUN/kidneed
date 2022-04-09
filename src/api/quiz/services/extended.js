"use strict";

const arrayDiff = require("lodash/difference");
const keyBy = require("lodash/keyBy");
const groupBy = require("lodash/groupBy");
const mapValues = require("lodash/mapValues");

module.exports = ({ strapi }) => ({
  async score({
    quizId,
    answers,
    quizValidation = () => {},
    groupKey = "field",
  }) {
    const quiz = await strapi.query("api::quiz.quiz").findOne({
      where: { id: quizId },
      populate: [
        "questions",
        "questions.growthSubfield",
        "questions.growthSubfield.growthField",
      ],
    });

    quizValidation(quiz);
    this.validateQuizAnswers(quiz, answers);

    const answerObj = keyBy(answers, "question");

    const mappedValueToField = quiz.questions.map((q) => ({
      value: answerObj[q.id].value,
      field: q.growthSubfield.growthField.id,
      subfield: q.growthSubfield.id,
    }));

    const groupedField = groupBy(mappedValueToField, groupKey);

    const result = mapValues(groupedField, (group) =>
      group.reduce((total, current) => total + current.value, 0)
    );

    return { quiz, result };
  },

  validateQuizAnswers(quiz, answers) {
    const questionIds = quiz.questions.map((q) => q.id);
    const answeredQuestionIds = answers.map((a) => a.question);

    if (questionIds.length !== answeredQuestionIds.length) {
      throw new Error(
        `Answers schema doesn't match with quiz schema, please provide right answers [you need to provide right questions ids]`
      );
    }

    const difference = arrayDiff(questionIds, answeredQuestionIds);

    if (difference.length !== 0) {
      throw new Error(
        `You need to answer all quiz questions, unanswereds are: ${difference.join(
          ","
        )}`
      );
    }
  },

  async systemQuiz(child) {
    const ageGroup = await strapi.service("api::age-group.extended").get(child);

    return await strapi
      .query("api::quiz.quiz")
      .findOne({ where: { ageGroup: ageGroup.id, type: "system" } });
  },

  async childQuiz(child, populate = ["questions"]) {
    const ageGroup = await strapi.service("api::age-group.extended").get(child);

    const growthField = await strapi
      .service("api::child-step.extended")
      .growthField(child.id);

    console.log({ ageGroup, growthField });
    if (!growthField) {
      throw new Error(`You need to select growth field of your child first`);
    }

    return strapi.query("api::quiz.quiz").findOne({
      where: { growthField: growthField.id, ageGroup: ageGroup.id },
      populate,
    });
  },
});
