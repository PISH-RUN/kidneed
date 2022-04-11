"use strict";

const nService = (strapi) => strapi.service("api::notification.notification");

module.exports = ({ strapi }) => ({
  async rahche({ rahche }) {
    await nService(strapi).create({
      data: {
        title: "rahche created",
        body: "rahce was created",
        type: "rahche",
        user: rahche.user.id,
        childId: rahche.child.id,
        payload: {
          id: rahche.id,
        },
      },
    });
  },
});
