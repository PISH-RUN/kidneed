"use strict";

/**
 * `has-activity` policy.
 */

module.exports = async (ctx, config, { strapi }) => {
  const { params } = ctx.request;
  const { id: childId } = params;

  const activityCount = await strapi
    .query("api::activity.activity")
    .count({ where: { child: childId } });

  return activityCount > 0;
};
