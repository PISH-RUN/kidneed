"use strict";

module.exports = async (ctx, config, { strapi }) => {
  const activityService = strapi.service("api::activity.activity");
  const { params } = ctx.request;
  const { id: activityId } = params;
  const { id: userId } = ctx.state.user;

  const activity = await activityService.findOne(activityId, {
    populate: ["child", "child.user"],
  });

  return activity?.child?.user?.id === userId;
};
