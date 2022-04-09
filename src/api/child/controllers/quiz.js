"use strict";

const minBy = require("lodash/minBy");
const objValues = require("lodash/values");
const mapObjValues = require("lodash/mapValues");
const { validateQuizSubmission } = require("./validations");

module.exports = {
  async find(ctx) {
    const { child } = ctx.state;
    const { populate } = ctx.request.query;

    try {
      var quiz = await strapi
        .service("api::quiz.extended")
        .childQuiz(child, { questions: { select: ["id", "body"] } });
    } catch (e) {
      return ctx.badRequest(e.message);
    }

    return { data: quiz.questions };
  },

  async submit(ctx) {
    const { child } = ctx.state;
    const { body } = ctx.request;
    const { type, answers } = body.data;

    const allowedTypes = await strapi
      .service("api::taken-quiz.extended")
      .typesEnum();

    await validateQuizSubmission(allowedTypes);

    try {
      var quiz = await strapi.service("api::quiz.extended").childQuiz(child);
    } catch (e) {
      return ctx.badRequest(e.message);
    }

    if (!quiz) {
      return ctx.notFound(`Quiz not found.`);
    }

    const takenQuiz = await strapi
      .service("api::taken-quiz.extended")
      .current(child.id, quiz.id, type);

    if (takenQuiz?.answers?.length > 0) {
      return ctx.locked(`You already passed this test`);
    }

    try {
      strapi.service("api::quiz.extended").validateQuizAnswers(quiz, answers);
    } catch (e) {
      return ctx.badRequest(e.message);
    }

    await answers.forEach(async ({ question, value }) => {
      await strapi
        .service("api::answer.answer")
        .create({ data: { question, value, takenQuiz: takenQuiz.id } });
    });

    return {
      ok: true,
    };
  },

  async growthFieldQuestions(ctx) {
    const { child } = ctx.state;

    const quiz = await strapi
      .service("api::quiz.extended")
      .systemQuiz(child, { questions: { select: ["id", "body"] } });

    if (!quiz) {
      return ctx.notFound(`Quiz not found.`);
    }

    return {
      data: quiz.questions,
    };
  },

  async growthField(ctx) {
    const { child } = ctx.state;
    const { body } = ctx.request;
    const { answers } = body.data;

    const childStep = await strapi
      .service("api::child-step.extended")
      .current(child.id, ["growthField"]);

    if (childStep.growthField) {
      return ctx.send(
        {
          data: {
            growthField: childStep.growthField,
          },
        },
        208
      );
    }

    const quiz = await strapi.service("api::quiz.extended").systemQuiz(child);

    try {
      var { result } = await strapi
        .service("api::quiz.extended")
        .score({ quizId: quiz.id, answers });
    } catch (e) {
      return ctx.badRequest(e.message);
    }

    const minField = minBy(
      objValues(mapObjValues(result, (value, field) => ({ value, field }))),
      "value"
    );

    const growthField = await strapi
      .service("api::growth-field.growth-field")
      .findOne(minField.field);

    await strapi
      .service("api::child-step.extended")
      .selectField(child.id, growthField.id);

    return {
      data: {
        growthField,
      },
    };
  },
};
