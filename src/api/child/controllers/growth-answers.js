"use strict";

const { validateFieldSelection } = require("./validations");

module.exports = {
  async selectField(ctx) {
    const { params, body } = ctx.request;
    const allowedFields = await strapi
      .service("api::growth-question.extended")
      .fieldsEnum();

    await validateFieldSelection(allowedFields)(body.data);

    const { id: childId } = params;
    const { field } = body.data;

    const childStep = await strapi
      .service("api::child-step.extended")
      .selectField(childId, field);

    return { ok: true, field };
  },

  async submit(ctx) {
    const { params, body } = ctx.request;
    const { id: childId } = params;
    const { answers } = body.data;

    const step = await strapi.service("api::step.extended").current();

    await answers.forEach(async (answer) => {
      await createAnswer(answer, step.id, childId);
    });

    return { ok: true };
  },
};

async function createAnswer(answer, stepId, childId) {
  const growthAnswerQuery = strapi.query("api::growth-answer.growth-answer");
  const growthAnswerService = strapi.service(
    "api::growth-answer.growth-answer"
  );

  const foundAnswer = await growthAnswerQuery.findOne({
    where: { step: stepId, child: childId, question: answer.question },
  });

  if (!foundAnswer) {
    await growthAnswerService.create({
      data: {
        child: childId,
        step: stepId,
        value: answer.value,
        question: answer.question,
      },
    });
    return;
  }

  await growthAnswerService.update({
    where: { id: foundAnswer.id },
    data: { value: answer.value },
  });
}
