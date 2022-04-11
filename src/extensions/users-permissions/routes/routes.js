module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/jwt",
      handler: "auth.jwt",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
    {
      method: "GET",
      path: "/users/me/notifications",
      handler: "notification.find",
      config: {
        prefix: "",
      },
    },
  ],
};
