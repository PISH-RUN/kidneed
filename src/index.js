"use strict";

async function cleanup(strapi) {
  await strapi.query("api::question.question").deleteMany();
  await strapi.query("api::quiz.quiz").deleteMany();
  await strapi.query("api::answer.answer").deleteMany();
  await strapi.query("api::taken-quiz.taken-quiz").deleteMany();
}

module.exports = {
  async register({ strapi }) {},

  async bootstrap({ strapi }) {
    await strapi.service("plugin::sms.messenger").register("otp", {
      ghasedak: (provider) => async (user, token) => {
        try {
          const response = await provider.verification({
            receptor: user,
            template: "koodak",
            params: { param1: token },
          });
        } catch (e) {
          console.error(
            `something went wrong in sending ghasedak verification`,
            e.message
          );
        }
      },
    });

    // await strapi.service("plugin::sms.messenger").otp("+989304900220", "1234");
  },
};
