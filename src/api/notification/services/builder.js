"use strict";

const nService = (strapi) => strapi.service("api::notification.notification");
const nQuery = (strapi) => strapi.query("api::notification.notification");

module.exports = ({ strapi }) => ({
  async rahche({ rahche }) {
    const { approaches, rahche: newRahche } = await strapi
      .service("api::rahche.extended")
      .approaches(rahche);

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

  async goalAssist(activity, growthField) {
    const editions = await strapi
      .service("api::activity.dapi")
      .editions(activity.content, growthField.symbol);

    if (!editions) {
      return;
    }

    const text = editions
      .filter((edition) => edition.attributes.payload?.length > 0)
      .map((edition) =>
        edition.attributes.payload.map((pass) => pass.text).join("\n")
      );

    if (!text.length) {
      return;
    }

    await nQuery(strapi).create({
      data: {
        child: activity.child.id,
        user: activity.child.user.id,
        type: "goalAssist",
        title: "پاس گل",
        body: text.join("\n"),
        payload: {
          content: activity.content,
          text,
          editions: editions.map((edition) => edition.id),
          growthField,
        },
      },
    });
  },
});
