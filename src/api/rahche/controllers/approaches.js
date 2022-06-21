"use strict";

module.exports = {
  async find(ctx) {
    const { rahche } = ctx.state;

    if (rahche.roots?.length < 1) {
      return ctx.badRequest(
        `You need to select roots before getting approaches`
      );
    }

    const { approaches } = await strapi
      .service("api::rahche.extended")
      .approaches(rahche, { populate: ["approach.voice"] });

    return { data: { approaches, subject: rahche.subject } };
  },
};
