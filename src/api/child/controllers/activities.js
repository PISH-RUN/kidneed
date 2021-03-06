"use strict";

const merge = require("lodash/merge");
const groupBy = require("lodash/groupBy");
const mapValues = require("lodash/mapValues");
const omit = require("lodash/omit");
const { monthRemainingDays } = require("../../../utils/date");
const { validateCreateActivity } = require("./validations");
const findKey = require("lodash/findKey");
const {
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  startOfDay,
  endOfDay,
} = require("date-fns");
const {
  newDate: jNewDate,
  getMonth: jGetMonth,
  getYear: jGetYear,
} = require("date-fns-jalali");

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
      .service("api::activity.dapi")
      .contents([content1, content2], ["id", "type"]);

    const activity1 = await createActivity({
      content: content1.toString(),
      date,
      child: childId,
      type: contents[content1].type,
    });

    const activity2 = await createActivity({
      content: content2.toString(),
      date,
      child: childId,
      type: contents[content2].type,
    });

    return { data: [activity1, activity2] };
  },

  async findOne(ctx) {
    const { params } = ctx.request;
    const { id: childId, activity: activityId } = params;

    const activity = await strapi
      .service("api::activity.activity")
      .findOne(activityId, { populate: ["child.user"] });

    if (!activity || activity.child.id !== Number(childId)) {
      return ctx.badRequest(`You can't get this activity`);
    }

    return { data: omit(activity, "child") };
  },

  async find(ctx) {
    const { params, query } = ctx.request;
    const { id: childId } = params;

    const newQuery = merge(query, {
      filters: { child: Number(childId) },
    });

    ctx.request.query = newQuery;

    const result = await strapi.controller("api::activity.activity").find(ctx);

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
      select: ["id", "duration", "date"],
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

  async share(ctx) {
    const { child } = ctx.state;
    const { query } = ctx.request;
    let { month, year } = query;
    const now = new Date();

    month = month ? Number(month) : jGetMonth(now);
    year = year ? Number(year) : jGetMonth(now);

    const start = format(startOfDay(jNewDate(year, month, 1)), "yyyy-MM-dd");
    const end = format(
      endOfDay(jNewDate(year, month, month > 6 ? 30 : 31)),
      "yyyy-MM-dd"
    );

    const activities = await strapi.query("api::activity.activity").findMany({
      where: { child: child.id, date: { $gte: start, $lte: end } },
      select: ["id", "duration", "type"],
    });

    const result = mapValues(groupBy(activities, "type"), (activities) => ({
      share: activities.reduce(
        (total, activity) => total + (activity.duration || 0),
        0
      ),
    }));

    return { data: result };
  },
};
