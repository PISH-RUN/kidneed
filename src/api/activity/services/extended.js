"use strict";

var axios = require("axios");
var addDays = require("date-fns/addDays");
var getYear = require("date-fns/getYear");
const qs = require("qs");

const DAPI_URL = "https://dapi.pish.run";

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
    const { birthYear, gender } = child;
    const age = getYear(new Date()) - birthYear;
    const response = await axios.get(
      `${DAPI_URL}/api/plan-generator?daysCount=${days}&age=${age}&gender=${gender}`
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
  async contentsInfo(ids, fields = ["title"]) {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $in: ids,
          },
        },
        fields: fields,
        publicationState: "preview",
      },
      {
        encodeValuesOnly: true,
      }
    );

    const response = await axios.get(`${DAPI_URL}/api/contents?${query}`);

    return response.data.data.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr.attributes }),
      {}
    );
  },
});
