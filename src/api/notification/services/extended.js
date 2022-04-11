"use strict";

const nQuery = (strapi) => strapi.query("api::notification.notification");

module.exports = ({ strapi }) => ({
  async readAll(userId) {
    const unreadNotifications = await nQuery(strapi).findMany({
      where: { user: userId, readAt: null },
      select: ["id"],
    });

    if (unreadNotifications.length < 1) {
      return { count: 0 };
    }

    const now = new Date();
    return await nQuery(strapi).updateMany({
      where: { id: { $in: unreadNotifications.map((n) => n.id) } },
      data: { readAt: now },
    });
  },
  async unread(userId) {
    return await nQuery(strapi).count({
      where: { user: userId, readAt: null },
    });
  },
});
