"use strict";

const omit = require("lodash/omit");
const { validateFieldSelection } = require("./validations");

module.exports = {
  async select(ctx) {
    const { params, body } = ctx.request;
    const allowedFields = await strapi
      .query("api::growth-field.growth-field")
      .findMany();

    await validateFieldSelection(allowedFields.map((f) => f.id))(body.data);

    const { id: childId } = params;
    const { field } = body.data;

    try {
      await strapi
        .service("api::child-step.extended")
        .selectField(childId, field);
    } catch (e) {
      return ctx.locked(e.message);
    }

    return { ok: true };
  },

  async result(ctx) {
    const { child } = ctx.state;
    const step = await strapi.service("api::step.extended").current();

    const takenQuizzes = await strapi
      .query("api::taken-quiz.taken-quiz")
      .findMany({
        where: { step: step.id, child: child.id },
        select: ["id", "type"],
        populate: {
          quiz: {
            select: [],
            populate: { growthField: { id: true, select: "id" } },
          },
        },
      });

    const result = await Promise.allSettled(
      takenQuizzes.map(async (takenQuiz) => ({
        type: takenQuiz.type,
        growthField: takenQuiz.quiz.growthField.id,
        result: await strapi
          .service("api::quiz.extended")
          .takenQuizScore(takenQuiz.id),
      }))
    );

    const response = result.reduce(
      (acc, r) => ({ ...acc, [r.value.type]: omit(r.value, "type") }),
      {}
    );

    return {
      data: response,
    };
  },
};
