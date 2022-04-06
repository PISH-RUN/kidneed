"use strict";

const merge = require("lodash/merge");
const groupBy = require("lodash/groupBy");
const mapValues = require("lodash/mapValues");
const addDays = require("date-fns/addDays");
const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");
const { monthRemainingDays } = require("../../../utils/date");

module.exports = {
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

    const startDay = startOfDay(new Date());
    const endDay = endOfDay(addDays(startDay, remainingDays));

    const activities = await strapi.query("api::activity.activity").findMany({
      where: { child: childId, date: { $gte: startDay, $lt: endDay } },
      select: ["duration", "date"],
    });

    console.log(groupBy(activities, "date"));

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

    const startDay = startOfDay(Date.parse(from));
    const endDay = endOfDay(Date.parse(to));

    const activities = await strapi.query("api::activity.activity").findMany({
      where: { child: childId, date: { $gte: startDay, $lt: endDay } },
      select: ["progress", "type"],
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