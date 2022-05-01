"use strict";

const omit = require("lodash/omit");
const random = require("lodash/random");
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

    const response = result
      .filter((r) => r.status === "fulfilled")
      .reduce(
        (acc, r) => ({ ...acc, [r.value.type]: omit(r.value, "type") }),
        {}
      );

    return {
      data: response,
    };
  },

  async progresssion(ctx) {
    const { child } = ctx.state;
    const growthFields = await strapi
      .query("api::growth-field.growth-field")
      .findMany({
        select: ["id"],
        populate: { growthSubfields: { select: ["id"] } },
      });

    const childStep = await strapi
      .service("api::child-step.extended")
      .current(child.id, ["growthField"]);

    const result = growthFields.reduce((r, gf) => {
      let total = 100;
      const count = gf.growthSubfields.length;
      const center = Math.round(total / count);
      const threshold = Math.round(16 / count);
      const subfields = gf.growthSubfields.reduce((r, gsf, index) => {
        const percent = random(center - threshold, center + threshold);
        if (index !== count - 1) {
          total -= percent;
        }

        return {
          ...r,
          [gsf.id]: {
            percent: index === count - 1 ? total : percent,
          },
        };
      }, {});

      return {
        ...r,
        [gf.id]: {
          percent: childStep.growthField.id === gf.id ? 40 : 20,
          subfields,
        },
      };
    }, {});

    return { data: result };
  },
};
