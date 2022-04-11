module.exports = {
  async unreadNotifcations(ctx) {
    const { user } = ctx.state;

    const unreadNotifications = await strapi
      .query("api::notification.notification")
      .count({ where: { user: user.id, readAt: null } });

    return { unreadNotifications };
  },
};
