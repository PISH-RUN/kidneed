"use strict";

const zarinpal = require("./lib/zarinpal");
const subscription = require("./cron/subscription");

async function cleanup(strapi) {
  await strapi.query("api::question.question").deleteMany();
  await strapi.query("api::quiz.quiz").deleteMany();
  await strapi.query("api::answer.answer").deleteMany();
  await strapi.query("api::taken-quiz.taken-quiz").deleteMany();
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }) {
    strapi.zarinpal = zarinpal({ strapi });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await subscription({ strapi });
  },
};
