module.exports = {
  push: [
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
  unshift: [
    {
      method: "PUT",
      path: "/users/me",
      handler: "me.update",
      config: {
        prefix: "",
      },
    },
  ],
};
