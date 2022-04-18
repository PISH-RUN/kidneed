"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/activities/:id/progress",
      handler: "activity.progress",
      config: {
        policies: ["activity-owner"],
      },
    },
    {
      method: "POST",
      path: "/activities/:id/seen",
      handler: "activity.seen",
      config: {
        policies: ["activity-owner"],
      },
    },
  ],
};
