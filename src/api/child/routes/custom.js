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
      path: "/children/:id/activities",
      handler: "activities.create",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "GET",
      path: "/children/:id/current-month-activity-glance",
      handler: "activities.monthGlance",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "GET",
      path: "/children/:id/stats",
      handler: "activities.stats",
      config: {
        policies: ["global::child-owner"],
      },
    },

    {
      method: "GET",
      path: "/children/:id/growth-field-questions",
      handler: "quiz.growthFieldQuestions",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "GET",
      path: "/children/:id/quiz",
      handler: "quiz.find",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "POST",
      path: "/children/:id/quiz",
      handler: "quiz.submit",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "POST",
      path: "/children/:id/find-growth-field",
      handler: "quiz.growthField",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "POST",
      path: "/children/:id/select-growth-field",
      handler: "growth-field.select",
      config: {
        policies: ["global::child-owner"],
      },
    },
    {
      method: "GET",
      path: "/children/:id/growth-field-result",
      handler: "growth-field.result",
      config: {
        policies: ["global::child-owner"],
      },
    },
  ],
};
