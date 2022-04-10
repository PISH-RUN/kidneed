"use strict";

/**
 *  rahche controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::rahche.rahche", ({ strapi }) => ({
  async select(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { subject } = body.data;

    const rahcheSubject = await strapi
      .service("api::rahche-subject.rahche-subject")
      .findOne(subject);

    if (!rahcheSubject) {
      return ctx.notFound(`Subject not found.`);
    }

    const rahche = await strapi
      .service("api::rahche.rahche")
      .create({ data: { user: user.id, subject: rahcheSubject.id } });

    return {
      data: rahche,
    };
  },
}));
