module.exports = {
  overwrite: (parent) => ({
    ...parent,
    async me(ctx) {
      await parent.me(ctx);

      const { user } = ctx.state;

      const unreadNotifications = await strapi
        .service("api::notification.extended")
        .unread(user.id);

      const hasLockPassword = !!user.lockPassword;

      ctx.body = { ...ctx.body, unreadNotifications, hasLockPassword };
    },
  }),
};
