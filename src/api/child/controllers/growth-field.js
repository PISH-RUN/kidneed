"use strict";

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
};
