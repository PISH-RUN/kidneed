"use strict";

const arrayDiff = require("lodash/difference");

function validateQuizAnswers(quiz, answers) {
  const questionIds = quiz.questions.map((q) => q.id);
  const answeredQuestionIds = answers.map((a) => a.question);

  const difference = arrayDiff(questionIds, answeredQuestionIds);

  if (
    questionIds.length !== answeredQuestionIds.length ||
    difference.length !== 0
  ) {
    return [false, difference];
  }

  return [true];
}

module.exports = {
  async submit(ctx) {
    const { params, body } = ctx.request;

    const { id: childId } = params;
    const { quiz: quizId, answers, type } = body.data;

    const takenQuiz = await strapi
      .service("api::taken-quiz.extended")
      .current(childId, quizId, type);

    if (!quiz) {
      return;
    }

    if (takenQuiz?.questions?.length > 0) {
      return;
    }

    const questionIds = quiz.questions.map((q) => q.id);
    const answeredQuestionIds = answers.map((a) => a.question);

    const difference = arrayDiff(questionIds, answeredQuestionIds);
    if (
      questionIds.length !== answeredQuestionIds.length ||
      difference.length !== 0
    ) {
      return ctx.badRequest(
        `You need to answer all quiz questions, unanswereds are: ${difference.join(
          ","
        )}`
      );
    }

    answers.forEach(({ question, value }) => {
      strapi
        .service("api::answer.answer")
        .create({ data: { question, value, taken_quiz: takenQuiz.id } });
    });
  },
  async growthField(ctx) {
    const { params, body } = ctx.request;

    const { id: childId } = params;
    const { quiz: quizId, answers } = body.data;

    const childStep = await strapi
      .service("api::child-step.extended")
      .current(childId);

    if (childStep.growthField) {
      return {
        data: {
          growthField: childStep.growthField,
        },
      };
    }

    const quiz = await strapi
      .service("api::quiz.quiz")
      .find(quizId, { populate: ["questions"] });

    if (!quiz || quiz.type !== "system") {
      return ctx.badRequest(`No Quiz found.`);
    }

    const [isValid, diff] = validateQuizAnswers(quiz, answers);

    if (!isValid) {
      let message = `Answers schema doesn't match with quiz schema, please provide right answers [you need to provide right questions ids]`;
      if (diff.length > 0) {
        message = `You need to answer all quiz questions, unanswereds are: ${diff.join(
          ","
        )}`;
      }
      return ctx.badRequest(message);
    }

    answers.forEach(async ({ question, value }) => {
      await strapi
        .service("api::answer.answer")
        .create({ data: { question, value, taken_quiz: takenQuiz.id } });
    });
  },
};
