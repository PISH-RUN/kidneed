"use strict";

/**
 *  activity controller
 */
const { validateProgressBody } = require("./validations");
const { createCoreController } = require("@strapi/strapi").factories;

const activityService = (strapi) => strapi.service("api::activity.activity");

module.exports = createCoreController(
  "api::activity.activity",
  ({ strapi }) => ({
    async progress(ctx) {
      const { body } = ctx.request;
      await validateProgressBody(body.data);

      const { progress } = body.data;
      const { activity } = ctx.state;

      const updatedActivity = await activityService(strapi).update(
        activity.id,
        {
          data: { progress: (activity.progress || 0) + progress },
        }
      );

      return { data: updatedActivity };
    },

    async seen(ctx) {
      const { activity } = ctx.state;

      if (activity.seen) {
        return ctx.badRequest(`This activity have been seen`);
      }

      const childStep = await strapi
        .service("api::child-step.extended")
        .current(activity.child.id, ["growthField"]);

      if (!childStep.growthField) {
        return ctx.badRequest(`Please select growth field`);
      }

      await strapi.service("api::activity.edit").seen(activity.id);

      strapi
        .service("api::notification.builder")
        .goalAssist(activity, childStep.growthField);

      return {
        ok: true,
      };
    },
  })
);
