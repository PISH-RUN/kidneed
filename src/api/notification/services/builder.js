"use strict";

const nService = (strapi) => strapi.service("api::notification.notification");
const nQuery = (strapi) => strapi.query("api::notification.notification");

module.exports = ({ strapi }) => ({
  async rahche({ rahche }) {
    console.log(rahche);
    await nService(strapi).create({
      data: {
        title: "rahche created",
        body: "rahce was created",
        type: "rahche",
        user: rahche.user.id,
        child: rahche.child.id,
        payload: {
          id: rahche.id,
        },
      },
    });
  },
  async endOfMonthQuiz({ child }) {
    await nQuery(strapi).create({
      data: {
        child: child.id,
        user: child.user.id,
        type: "endOfMonthQuiz",
        title: "take end of month quiz",
        body: "take end of month quiz",
      },
    });
  },
});
