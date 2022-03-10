'use strict';

const { childStepPhychology } = require('../../venus/controllers/venus');

/**
 *  child controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::child.child', ({strapi}) => ({
    async create(ctx) {
        const child = await super.create(ctx);
        const date = new Date()
        const gender = child.data.attributes.gender
        const childId = child.data.id
        const age = child.data.attributes.age
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
    }
}));
