"use strict";

/**
 *  activity controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::activity.activity",
  ({ strapi }) => ({
    async progress(ctx) {
      const activityService = strapi.service("api::activity.activity");
      const { params, body } = ctx.request;

      const { progress } = body.data;
      const { id: activityId } = params;

      const activity = await activityService.findOne(activityId);

      const updatedActivity = await activityService.update(activity.id, {
        data: { progress: (activity.progress || 0) + progress },
      });

      return { data: updatedActivity };
    },
  })
);
