"use strict";

const merge = require("lodash/merge");
const pick = require("lodash/pick");
const omit = require("lodash/omit");
var getYear = require("date-fns-jalali/getYear");

const childService = () => strapi.service("api::child.child");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::child.child", ({ strapi }) => ({
  async create(ctx) {
    const child = await super.create(ctx);
    const date = new Date();
    const gender = child.data.attributes.gender;
    const childId = child.data.id;
    const age = child.data.attributes.age;
    const moment = require("jalali-moment");
    const axios = require("axios");

    const jalaliDate = moment(date).locale("fa").format("DD");
    const MonthLastDay = moment(date).locale("fa").endOf("month").format("DD");

    const remainDaysCount = MonthLastDay - jalaliDate + 1;

    const result = (
      await axios.get(
        `https://dapi.pish.run/api/plan-generator?daysCount=${remainDaysCount}&age=${age}&gender=${gender}`
      )
    ).data;
    for (const day of result) {
      for (const content of day.contents) {
        await strapi.db.query("api::activity.activity").create({
          data: {
            date: new Date(Date.now() + 3600 * 1000 * 24 * (day.dayIndex - 1)),
            child: childId,

            type: content.type,
            contentId: content.content1Id,
          },
        });
        await strapi.db.query("api::activity.activity").create({
          data: {
            date: new Date(Date.now() + 3600 * 1000 * 24 * (day.dayIndex - 1)),
            child: childId,

            type: content.type,
            contentId: content.content2Id,
          },
        });
      }
    }

    return child;
  },
  async register(ctx) {
    const extendedChildService = strapi.service("api::child.extended");
    const userService = strapi.service("plugin::users-permissions.user");

    const { body } = ctx.request;
    const { data } = body;
    const { user } = ctx.state;

    const childData = merge(pick(data, ["age", "gender", "relation"]), {
      name: data.childName,
      birthYear: getYear(new Date()) - data.age,
    });

    ctx.request.body = {
      data: childData,
    };

    const createdChild = await super.create(ctx);
    const updatedChild = await extendedChildService.attachUser(
      createdChild.data.id,
      user.id
    );

    if (data.parentName && !user.name) {
      await userService.edit(user.id, { name: data.parentName });
    }

    return createdChild;
  },

  async mine(ctx) {
    const { query } = ctx.request;
    const { user } = ctx.state;

    ctx.request.query = merge(query, { filters: { user: user.id } });

    return super.find(ctx);
  },

  async growthField(ctx) {
    const { user } = ctx.state;
    const { params, query } = ctx.request;

    const child = await childService().findOne(params.id, {
      populate: ["user"],
    });

    if (!child || child.user.id !== user.id) {
      return ctx.badRequest(`Child not found`);
    }
    const { month, year } = query;

    const growthField = await strapi
      .service("api::child-step.extended")
      .growthField(child.id, month, year);

    return { data: growthField };
  },
}));
