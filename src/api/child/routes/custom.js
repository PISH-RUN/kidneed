module.exports = {
  routes: [
    {
      method: "POST",
      path: "/children/register",
      handler: "child.register",
    },
    {
      method: "GET",
      path: "/my-children",
      handler: "child.mine",
    },
    {
      method: "GET",
      path: "/children/:id/activities",
      handler: "activities.find",
      config: {
        middlewares: ["api::child.activities-middleware"],
        policies: ["activities-policy"],
      },
    },
  ],
};
