"use strict";

const merge = require("lodash/merge");
const groupBy = require("lodash/groupBy");
const mapValues = require("lodash/mapValues");
const addDays = require("date-fns/addDays");
const format = require("date-fns/format");
const endOfDay = require("date-fns/endOfDay");
const { monthRemainingDays } = require("../../../utils/date");
const { validateCreateActivity } = require("./validations");
const findKey = require("lodash/findKey");

async function createActivity(data) {
  return await strapi.service("api::activity.activity").create({ data });
}

module.exports = {
  async create(ctx) {
    const { body, params } = ctx.request;
    await validateCreateActivity(body.data);

    const { id: childId } = params;
    const { content1, content2, date } = body.data;

    const contents = await strapi
      .service("api::activity.extended")
      .contentsInfo([content1, content2], ["meta"]);

    const activity1 = await createActivity({
      content: content1.toString(),
      date,
      child: childId,
      duration: findKey(contents[content1].meta, "duration") || 0,
    });

    const activity2 = await createActivity({
      content: content2.toString(),
      date,
      child: childId,
      duration: findKey(contents[content2].meta, "duration") || 0,
    });

    return { data: [activity1, activity2] };
  },

  async find(ctx) {
    const { params, query } = ctx.request;
    const { id: childId } = params;

    const newQuery = merge(query, {
      filters: { child: Number(childId) },
    });

    ctx.request.query = newQuery;

    const result = await strapi.controller("api::activity.activity").find(ctx);

    const ids = result.data.map((data) => data.id).filter((id) => id);
    const contents = await strapi
      .service("api::activity.extended")
      .contentsInfo(ids, ["title"]);

    result.data = result.data.map((data) =>
      merge(data, {
        attributes: {
          title: contents[data.id]?.title,
        },
      })
    );

    return result;
  },

  async monthGlance(ctx) {
    const { id: childId } = ctx.request.params;
    const remainingDays = monthRemainingDays(new Date());

    const today = new Date();
    const startDay = format(today, "yyyy-MM-dd");
    const endDay = format(addDays(today, remainingDays), "yyyy-MM-dd");

    const activities = await strapi.query("api::activity.activity").findMany({
      where: { child: childId, date: { $gte: startDay, $lte: endDay } },
      select: ["duration", "date"],
    });

    const result = mapValues(groupBy(activities, "date"), (activities) => ({
      duration: activities.reduce(
        (total, activity) => total + activity.duration,
        0
      ),
      count: activities.length,
    }));

    return { data: result };
  },

  async stats(ctx) {
    const { params, query } = ctx.request;
    const { id: childId } = params;
    const { from, to } = query;

    if (!from || !to) {
      return ctx.badRequest(`You need to provide both from and to`);
    }

    const activities = await strapi.query("api::activity.activity").findMany({
      where: { child: childId, date: { $gte: from, $lte: to } },
      select: ["id", "progress", "type"],
    });

    const result = mapValues(groupBy(activities, "type"), (activities) => ({
      progress: activities.reduce(
        (total, activity) => total + (activity.progress || 0),
        0
      ),
    }));

    return { data: result };
  },
};
