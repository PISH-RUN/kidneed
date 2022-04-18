"use strict";

const nService = (strapi) => strapi.service("api::notification.notification");
const nQuery = (strapi) => strapi.query("api::notification.notification");

module.exports = ({ strapi }) => ({
  async rahche({ rahche }) {
    const { approaches, rahche: newRahche } = await strapi
      .service("api::rahche.extended")
      .approaches(rahche);

    console.log(approaches);

    await nService(strapi).create({
      data: {
        title: newRahche.subject.name,
        body: approaches.length.toString(),
        type: "rahche",
        user: newRahche.user.id,
        child: newRahche.child.id,
        payload: {
          id: newRahche.id,
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
