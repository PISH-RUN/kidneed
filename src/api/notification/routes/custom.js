module.exports = {
  routes: [
    {
      method: "POST",
      path: "/notifications/read",
      handler: "notification.readAll",
    },
  ],
};
