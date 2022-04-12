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
    {
      method: "POST",
      path: "/users/me/verify-lock-password",
      handler: "me.verifyLockPassword",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
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
