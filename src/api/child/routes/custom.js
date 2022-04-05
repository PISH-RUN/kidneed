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
        policies: ["global::child-owner"],
      },
    },
    {
      method: "POST",
      path: "/children/:id/growth-answers",
      handler: "growth-answers.submit",
      config: {
        policies: ["global::child-owner"],
      },
    },
  ],
};
