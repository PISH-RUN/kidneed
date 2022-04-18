"use strict";

const aService = (strapi) => strapi.service("api::activity.activity");

module.exports = ({ strapi }) => ({
  async seen(activityId) {
    await aService(strapi).update(activityId, { data: { seen: true } });
  },
});
