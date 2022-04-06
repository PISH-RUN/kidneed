"use strict";

/**
 *  activity controller
 */
const { validateProgressBody } = require("./validations");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::activity.activity",
  ({ strapi }) => ({
    async progress(ctx) {
      const { params, body } = ctx.request;

      await validateProgressBody(body.data);

      const { progress } = body.data;
      const { id: activityId } = params;
      const activityService = strapi.service("api::activity.activity");

      const activity = await activityService.findOne(activityId);

      const updatedActivity = await activityService.update(activity.id, {
        data: { progress: (activity.progress || 0) + progress },
      });

      return { data: updatedActivity };
    },
  })
);
