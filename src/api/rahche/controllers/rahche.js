"use strict";

const { validateSelectSubject } = require("./validations/rahche");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::rahche.rahche", ({ strapi }) => ({
  async select(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { subject, child: childId } = body.data;

    await validateSelectSubject(body.data);

    const child = await strapi
      .service("api::child.child")
      .findOne(childId, { populate: ["user"] });

    if (child?.user?.id !== user.id) {
      return ctx.forbidden();
    }

    const rahcheSubject = await strapi
      .service("api::rahche-subject.rahche-subject")
      .findOne(subject);

    if (!rahcheSubject) {
      return ctx.notFound(`Subject not found.`);
    }

    const rahche = await strapi
      .service("api::rahche.rahche")
      .create({
        data: { user: user.id, subject: rahcheSubject.id, child: child.id },
      });

    return {
      data: rahche,
    };
  },
}));
