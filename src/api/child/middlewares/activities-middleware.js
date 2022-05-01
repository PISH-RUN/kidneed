"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { params } = ctx.request;
    const { id: childId } = params;

    const childStep = await strapi
      .service("api::child-step.extended")
      .current(childId, ["growthField"]);

    if (!childStep.growthField) {
      return ctx.notAcceptable(
        "please first select growth field of your child for this step"
      );
    }

    if (childStep.planGenerated) {
      return next(ctx);
    }

    const child = await strapi.service("api::child.child").findOne(childId);

    try {
      await strapi.service("api::activity.plan").generate(child);
    } catch (e) {
      console.log(e);
      return ctx.badRequest("something went wrong when generating plan");
    }

    return next(ctx);
  };
};
