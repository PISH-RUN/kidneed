const { monthRemainingDays } = require("../utils/date");

const objDiff = require("lodash/differenceBy");
const subDays = require("date-fns/subDays");

module.exports = async ({ strapi }) => {
  const remaining = monthRemainingDays(new Date());

  if (remaining > 2) {
    return;
  }

  const step = await strapi.service("api::step.extended").current();
  const children = await strapi.query("api::child.child").findMany({
    where: { takenQuizzes: { type: "startOfMonth", step: step.id } },
    populate: {
      user: {
        select: ["id"],
      },
    },
    select: ["id"],
  });

  const passedQuiz = await strapi.query("api::taken-quiz.taken-quiz").findMany({
    where: { step: step.id, type: "endOfMonth" },
    select: ["id"],
    populate: {
      child: {
        select: ["id"],
      },
    },
  });

  const unpassedChildren = objDiff(
    children,
    passedQuiz.map((q) => q.child),
    "id"
  );

  const notifiedChildren = await strapi
    .query("api::notification.notification")
    .findMany({
      where: {
        type: "endOfMonthQuiz",
        createdAt: { $gte: subDays(new Date(), 3) },
      },
      select: ["id"],
      populate: {
        child: {
          select: ["id"],
        },
      },
    });

  const unnotifiedChildren = objDiff(
    unpassedChildren,
    notifiedChildren.map((n) => n.child),
    "id"
  );

  unnotifiedChildren.reduce(async (acc, child) => {
    await acc;
    return strapi
      .service("api::notification.builder")
      .endOfMonthQuiz({ child });
  }, Promise.resolve());
};
