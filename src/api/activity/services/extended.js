"use strict";

var axios = require("axios");
var addDays = require("date-fns/addDays");

const activityData = (content, child, contentId, dayIndex) => {
  const now = new Date();
  const { type, duration } = content;

  return {
    data: {
      child,
      type,
      duration,
      content: content[contentId].toString(),
      date: addDays(now, dayIndex),
    },
  };
};

module.exports = ({ strapi }) => ({
  async fetch(child, days) {
    const { age, gender } = child;
    const response = await axios.get(
      `https://dapi.pish.run/api/plan-generator?daysCount=${days}&age=${age}&gender=${gender}`
    );

    return response.data;
  },
  async generate(child, days) {
    const activities = await this.fetch(child, days);
    const activityService = strapi.service("api::activity.activity");

    for (const dayContent of activities) {
      const { dayIndex, contents } = dayContent;

      for (const content of contents) {
        await activityService.create(
          activityData(content, child.id, "content1Id", dayIndex)
        );

        await activityService.create(
          activityData(content, child.id, "content2Id", dayIndex)
        );
      }
    }
  },
});
